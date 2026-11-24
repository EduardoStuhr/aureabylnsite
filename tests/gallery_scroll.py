"""Browser regression checks for the multipage editorial experience."""
from pathlib import Path
import os
import unittest
from urllib.parse import parse_qs, urlsplit
from playwright.sync_api import expect, sync_playwright


class StudioTest(unittest.TestCase):
    def test_pages(self):
        with sync_playwright() as p:
            browser = p.chromium.launch(channel="chrome")
            for width in [320, 375, 390, 768, 1024, 1440, 1920]:
                with self.subTest(width=width):
                    page = browser.new_page(viewport={"width": width, "height": 900})
                    errors = []
                    page.on("pageerror", lambda error: errors.append(str(error)))
                    base = os.environ["PREVIEW_URL"].rstrip("/")
                    for path in ["/", "/portfolio", "/servicos", "/servicos/fox", "/curso", "/sobre", "/diario", "/contato", "/inexistente"]:
                        page.goto(base + path, wait_until="domcontentloaded")
                        expect(page.locator("h1")).to_have_count(1)
                        self.assertTrue(page.evaluate("document.documentElement.scrollWidth <= innerWidth"))
                        expect(page.locator(".pin-spacer")).to_have_count(0)
                        expect(page.locator("main")).to_be_focused()
                        self.assertNotIn("undefined", page.title())
                        if path == "/":
                            self.check_marquee(page, width)
                        if path == "/contato":
                            expect(page.get_by_role("link", name="WhatsApp +55 27 99920-2100")).to_have_attribute(
                                "href", "https://wa.me/5527999202100"
                            )
                        if width in [390, 1440] and path != "/inexistente":
                            for photo in page.locator("main img:visible").all():
                                photo.scroll_into_view_if_needed()
                                photo.evaluate("img => img.decode()")
                            page.evaluate("scrollTo({top:0, behavior:'instant'})")
                            Path("test-results").mkdir(exist_ok=True)
                            page.screenshot(path="test-results/" + str(width) + "-" + (path.strip("/").replace("/", "-") or "inicio") + ".png", full_page=True)
                    page.goto(base + "/portfolio")
                    expect(page.locator(".editorial-gallery article")).to_have_count(8)
                    if width == 1440:
                        cards = page.locator(".portfolio-card")
                        first = cards.nth(0)
                        first.scroll_into_view_if_needed()
                        original_y = first.bounding_box()["y"]
                        first.hover()
                        page.wait_for_function("""initial => document.querySelector('.portfolio-card').getBoundingClientRect().top < initial - 3""", arg=original_y)
                        expect(first.locator(".photo-action")).to_have_css("background-color", "rgb(104, 70, 55)")
                        page.mouse.move(0, 0)
                    page.get_by_role("searchbox").fill("henna")
                    expect(page.locator(".editorial-gallery article")).to_have_count(1)
                    photo = page.get_by_role("button", name="Ver detalhes de Design personalizado com henna")
                    photo.click()
                    expect(page.get_by_role("dialog")).to_be_visible()
                    page.keyboard.press("Escape")
                    expect(page.get_by_role("dialog")).not_to_be_visible()
                    expect(photo).to_be_focused()
                    page.get_by_role("searchbox").fill("")
                    expect(page.get_by_role("searchbox")).to_have_value("")
                    expect(page.locator(".editorial-gallery article")).to_have_count(8)
                    category = page.get_by_role("button", name="Sobrancelhas", exact=True)
                    category.click()
                    expect(category).to_have_attribute("aria-pressed", "true")
                    expect(page.locator(".editorial-gallery article")).to_have_count(2)
                    page.goto(base + "/portfolio?tecnica=fox")
                    expect(page.locator(".editorial-gallery article")).to_have_count(1)
                    expect(page.locator(".portfolio-caption")).not_to_contain_text("Ênfase no canto externo")
                    page.locator(".portfolio-caption").get_by_role("link", name="Conhecer o procedimento").click()
                    expect(page).to_have_url(base + "/servicos?procedimento=fox")
                    selected = page.locator("#procedimento-fox")
                    expect(selected.locator("details")).to_have_attribute("open", "")
                    expect(page.locator(".catalog-item")).to_have_count(8)
                    expect(page.locator(".catalog-group")).to_have_count(2)
                    selected.get_by_role("button", name="Agendar & consultar Efeito fox", exact=True).click()
                    expect(page.locator("#booking-service")).to_have_value("srv-fox")
                    page.keyboard.press("Escape")
                    selected.get_by_role("link", name="Ver resultado de Efeito fox").click()
                    expect(page).to_have_url(base + "/portfolio?tecnica=fox")
                    expect(page.locator(".editorial-gallery article")).to_have_count(1)
                    page.get_by_role("button", name="Ver todos os trabalhos").click()
                    expect(page.locator(".editorial-gallery article")).to_have_count(8)
                    page.goto(base + "/servicos/fox")
                    page.get_by_role("button", name="Consultar este procedimento").click()
                    expect(page.locator("#booking-service")).to_have_value("srv-fox")
                    page.get_by_label("Seu nome completo").fill("Beatriz Souza")
                    page.get_by_label("WhatsApp com DDD").fill("27999887766")
                    page.get_by_label("Observações (opcional)").fill("Preço & horário? + à tarde")
                    page.get_by_role("button", name="Continuar para WhatsApp").click()
                    link = page.get_by_role("link", name="Conversar no WhatsApp")
                    expect(link).to_be_focused()
                    destination = urlsplit(link.get_attribute("href"))
                    self.assertEqual((destination.scheme, destination.netloc, destination.path),
                                     ("https", "wa.me", "/5527999202100"))
                    query = parse_qs(destination.query)
                    self.assertEqual(set(query), {"text"})
                    self.assertIn("*Interesse:* Efeito fox", query["text"][0])
                    self.assertIn("Preço & horário? + à tarde", query["text"][0])
                    page.keyboard.press("Escape")
                    expect(page.get_by_role("dialog")).to_have_count(0)
                    page.goto(base + "/")
                    page.get_by_role("link", name="Ver trabalhos", exact=True).click()
                    expect(page).to_have_url(base + "/portfolio")
                    page.go_back()
                    expect(page).to_have_url(base + "/")
                    page.go_forward()
                    expect(page).to_have_url(base + "/portfolio")
                    self.assertEqual(errors, [])
                    page.close()
            browser.close()

    def check_marquee(self, page, width):
        marquee = page.locator(".studio-marquee")
        track = marquee.locator(".studio-marquee-track")
        expect(marquee).to_have_css("background-color", "rgb(41, 37, 31)")
        expect(track).to_have_css("color", "rgb(242, 237, 229)")
        expect(track).to_have_css("animation-iteration-count", "infinite")
        page.evaluate("document.fonts.ready")
        self.assertTrue(track.evaluate("""track => {
            const [first, second, last] = track.children;
            const cycle = second.offsetLeft - first.offsetLeft;
            return last.offsetLeft - second.offsetLeft === cycle &&
                track.scrollWidth - cycle >= track.parentElement.clientWidth;
        }"""))
        if width in [390, 1440]:
            Path("test-results").mkdir(exist_ok=True)
            marquee.evaluate("element => element.scrollIntoView({block: 'center', behavior: 'instant'})")
            track.evaluate("track => { const animation = track.getAnimations()[0]; animation.pause(); animation.currentTime = 0; }")
            page.screenshot(path=f"test-results/aura-pr18-tarja-{width}.png")
        page.emulate_media(reduced_motion="reduce")
        expect(track).to_have_css("animation-name", "none")
        expect(track.get_by_text("CURSO VIP TURMAS ABERTAS").first).to_be_visible()
        self.assertTrue(track.evaluate("track => track.scrollWidth <= track.clientWidth"))
        page.emulate_media(reduced_motion="no-preference")


if __name__ == "__main__":
    unittest.main()
