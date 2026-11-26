"""Exercise the static site's security boundaries without sending messages."""
import os
from datetime import datetime, timezone
import unittest
from urllib.parse import parse_qs, urlencode, urlsplit

from playwright.sync_api import expect, sync_playwright


class SecurityTest(unittest.TestCase):
    def test_preview(self):
        base = os.environ["PREVIEW_URL"].rstrip("/")
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(channel="chrome")
            for width in (390, 1440):
                with self.subTest(width=width):
                    page = browser.new_page(viewport={"width": width, "height": 900})
                    page.add_init_script("""
                        window.cspViolations = [];
                        document.addEventListener('securitypolicyviolation', event =>
                            window.cspViolations.push(event.effectiveDirective));
                    """)
                    for path in ("/", "/admin", "/login", "/debug", "/api", "/servicos/inexistente"):
                        response = page.goto(base + path, wait_until="domcontentloaded")
                        self.assert_security_headers(response.headers)
                        if path != "/":
                            expect(page.get_by_text("Página não encontrada", exact=True)).to_be_visible()
                    response = page.goto(base + "/portfolio?" + urlencode({"tecnica": "inexistente"}))
                    self.assert_security_headers(response.headers)
                    expect(page.locator(".editorial-gallery article")).to_have_count(7)
                    marker = "<aura-text-marker> & foto"
                    page.get_by_role("searchbox").fill(marker)
                    expect(page.get_by_role("status")).to_contain_text("Nenhum trabalho encontrado")
                    expect(page.locator("aura-text-marker")).to_have_count(0)

                    page.goto(base + "/contato")
                    for link in page.locator('a[target="_blank"]').all():
                        self.assertTrue({"noopener", "noreferrer"}.issubset(link.get_attribute("rel").split()))
                        destination = urlsplit(link.get_attribute("href"))
                        self.assertEqual(destination.scheme, "https")
                        self.assertIn(destination.hostname, {"www.instagram.com", "wa.me"})

                    page.clock.set_fixed_time(datetime(2026, 11, 26, 3, tzinfo=timezone.utc))
                    page.goto(base + "/servicos/fox")
                    expect(page.get_by_role("heading", name="Fox Eyes")).to_be_visible()
                    page.get_by_role("button", name="Consultar este procedimento").click()
                    page.locator("#booking-name").fill(marker)
                    expect(page.get_by_role("dialog").locator('input[type="tel"]')).to_have_count(0)
                    page.locator("#booking-notes").fill(marker)
                    date = page.locator("#booking-date")
                    today = "2026-11-26"
                    expect(date).to_have_value(today)
                    expect(date).to_have_attribute("min", today)
                    date.fill("2026-11-25")
                    submit = page.get_by_role("button", name="Continuar para WhatsApp")
                    submit.click()
                    expect(page.get_by_text("Selecione uma data igual ou posterior ao dia de hoje.")).to_be_visible()
                    date.fill(today)
                    submit.click()
                    link = page.get_by_role("link", name="Conversar no WhatsApp")
                    expect(link).to_be_focused()
                    expect(page.get_by_test_id("booking-confirmation")).to_contain_text(marker)
                    expect(page.locator("aura-text-marker")).to_have_count(0)
                    url = urlsplit(link.get_attribute("href"))
                    self.assertEqual((url.scheme, url.netloc, url.path), ("https", "wa.me", "/5527999202100"))
                    query = parse_qs(url.query)
                    self.assertEqual(set(query), {"text"})
                    self.assertIn(marker, query["text"][0])
                    self.assertNotIn("*WhatsApp:*", query["text"][0])
                    self.assertIn(today, query["text"][0])
                    self.assertIn("160,00", query["text"][0])
                    self.assertEqual(page.evaluate("window.cspViolations"), [])
                    self.assertEqual(page.evaluate("[localStorage.length, sessionStorage.length]"), [0, 0])
                    self.assertEqual(page.context.cookies(), [])

                    # A prepared link must be rechecked if the date changes at midnight.
                    page.clock.set_fixed_time(datetime(2026, 11, 27, 3, tzinfo=timezone.utc))
                    link.click()
                    expect(page.get_by_role("alert")).to_have_text("Selecione uma data igual ou posterior ao dia de hoje.")
                    expect(date).to_have_attribute("min", "2026-11-27")
                    date.fill("2026-11-28")
                    submit.click()
                    expect(link).to_be_focused()
                    self.assertIn("2026-11-28", parse_qs(urlsplit(link.get_attribute("href")).query)["text"][0])

                    page.keyboard.press("Escape")
                    page.clock.set_fixed_time(datetime(2026, 11, 29, 3, tzinfo=timezone.utc))
                    page.get_by_role("button", name="Consultar este procedimento").click()
                    expect(page.locator("#booking-name")).to_have_value("")
                    expect(date).to_have_attribute("min", "2026-11-29")
                    expect(date).to_have_value("2026-11-29")
                    expect(page.locator("#booking-notes")).to_have_value("")
                    page.keyboard.press("Escape")
                    page.goto(base + "/curso")
                    expect(page.get_by_text("Investimento", exact=True)).to_be_visible()
                    expect(page.get_by_text("R$ 1.200,00", exact=True)).to_be_visible()
                    page.get_by_role("button", name="Consultar informações do curso").click()
                    course = page.get_by_role("dialog", name="Conversar sobre o curso")
                    expect(course.locator("#booking-service")).to_have_value("srv-curso-lash")
                    page.keyboard.press("Escape")
                    page.get_by_role("button", name="Agendar horário", exact=True).click()
                    page.locator("#booking-service").select_option("srv-curso-lash")
                    expect(course.get_by_text("Investimento", exact=True)).to_be_visible()
                    expect(course.locator("#booking-date")).to_have_count(0)
                    course.locator("#booking-name").fill("Ana Teste")
                    course.get_by_role("button", name="Continuar para WhatsApp").click()
                    expect(course.get_by_test_id("booking-confirmation")).to_contain_text("R$ 1.200,00")
                    course_url = urlsplit(course.get_by_role("link", name="Conversar no WhatsApp").get_attribute("href"))
                    self.assertEqual((course_url.scheme, course_url.netloc, course_url.path),
                                     ("https", "wa.me", "/5527999202100"))
                    self.assertIn("com investimento de R$ 1.200,00.", parse_qs(course_url.query)["text"][0])
                    page.close()
            browser.close()

    def assert_security_headers(self, headers):
        policy = headers.get("content-security-policy", "")
        for directive in ("script-src 'self'", "object-src 'none'", "frame-ancestors 'none'",
                          "form-action 'none'", "upgrade-insecure-requests"):
            self.assertIn(directive, policy)
        self.assertNotIn("'unsafe-eval'", policy)
        self.assertEqual(headers.get("x-content-type-options"), "nosniff")
        self.assertEqual(headers.get("x-frame-options"), "DENY")
        self.assertEqual(headers.get("referrer-policy"), "strict-origin-when-cross-origin")
        self.assertIn("camera=()", headers.get("permissions-policy", ""))
        self.assertIn("max-age=15552000", headers.get("strict-transport-security", ""))


if __name__ == "__main__":
    unittest.main()
