"""Exercise the static site's security boundaries without sending messages."""
import os
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

                    page.goto(base + "/servicos/fox")
                    expect(page.get_by_role("heading", name="Fox Eyes")).to_be_visible()
                    page.get_by_role("button", name="Consultar este procedimento").click()
                    page.locator("#booking-name").fill(marker)
                    page.locator("#booking-whatsapp").fill("27999887766")
                    page.locator("#booking-notes").fill(marker)
                    date = page.locator("#booking-date")
                    today = date.input_value()
                    expect(date).to_have_attribute("min", today)
                    date.fill("2000-01-01")
                    submit = page.get_by_role("button", name="Continuar para WhatsApp")
                    submit.click()
                    expect(page.get_by_text("Escolha uma data válida a partir de hoje.")).to_be_visible()
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
                    self.assertIn("160,00", query["text"][0])
                    self.assertEqual(page.evaluate("window.cspViolations"), [])
                    self.assertEqual(page.evaluate("[localStorage.length, sessionStorage.length]"), [0, 0])
                    self.assertEqual(page.context.cookies(), [])

                    page.keyboard.press("Escape")
                    page.get_by_role("button", name="Consultar este procedimento").click()
                    expect(page.locator("#booking-name")).to_have_value("")
                    expect(page.locator("#booking-whatsapp")).to_have_value("")
                    expect(page.locator("#booking-notes")).to_have_value("")
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
