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
                    expect(page.locator(".editorial-gallery article")).to_have_count(7)
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
                    expect(page.locator(".editorial-gallery article")).to_have_count(7)
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
                    expect(page.locator(".catalog-item")).to_have_count(20)
                    expect(page.locator(".catalog-group")).to_have_count(4)
                    selected.get_by_role("button", name="Agendar & consultar Fox Eyes", exact=True).click()
                    expect(page.locator("#booking-service")).to_have_value("srv-fox")
                    expect(page.locator(".booking-service-value")).to_contain_text("160,00")
                    expect(page.locator(".booking-service-value")).to_contain_text("120 minutos")
                    page.locator("#booking-service").select_option("srv-brown")
                    expect(page.locator(".booking-service-value")).to_contain_text("150,00")
                    expect(page.locator(".booking-service-value")).to_contain_text("Duração sob consulta")
                    page.locator("#booking-service").select_option("srv-hibrido-classico")
                    expect(page.locator(".booking-service-value")).to_contain_text("145,00")
                    page.locator("#booking-service").select_option("srv-hibrido")
                    expect(page.locator(".booking-service-value")).to_contain_text("155,00")
                    page.keyboard.press("Escape")
                    selected.get_by_role("link", name="Ver resultado de Efeito fox").click()
                    expect(page).to_have_url(base + "/portfolio?tecnica=fox")
                    expect(page.locator(".editorial-gallery article")).to_have_count(1)
                    page.get_by_role("button", name="Ver todos os trabalhos").click()
                    expect(page.locator(".editorial-gallery article")).to_have_count(7)
                    page.goto(base + "/servicos/fox")
                    page.get_by_role("button", name="Consultar este procedimento").click()
                    expect(page.locator("#booking-service")).to_have_value("srv-fox")
                    page.locator("#booking-extra-service").select_option("srv-design-simples")
                    page.get_by_role("button", name="Adicionar", exact=True).click()
                    expect(page.get_by_role("list", name="Procedimentos selecionados").locator("li")).to_have_count(2)
                    expect(page.locator(".booking-service-value")).to_contain_text("190,00")
                    expect(page.locator(".booking-service-value")).to_contain_text("150 minutos")
                    expect(page.locator("#booking-extra-service option[value='srv-design-simples']")).to_have_count(0)
                    page.locator("#booking-extra-service").select_option("srv-brown")
                    page.get_by_role("button", name="Adicionar", exact=True).click()
                    expect(page.locator(".booking-service-value")).to_contain_text("340,00")
                    expect(page.locator(".booking-service-value")).to_contain_text("itens sob consulta")
                    page.get_by_role("button", name="Remover Volume brown", exact=True).click()
                    expect(page.locator(".booking-service-value")).not_to_contain_text("sob consulta")
                    if width in [390, 1440]:
                        page.screenshot(path=f"test-results/{width}-agendamento-multiplo.png")
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
                    self.assertIn("*Interesse:* Fox Eyes, Design simples", query["text"][0])
                    self.assertIn("190,00", query["text"][0])
                    self.assertIn("150 minutos", query["text"][0])
                    self.assertIn("Preço & horário? + à tarde", query["text"][0])
                    self.assertIn("160,00", query["text"][0])
                    self.assertIn("120 minutos", query["text"][0])
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
        expect(marquee).to_have_css("background-color", "rgb(0, 0, 0)")
        expect(marquee).to_have_css("background-image", "none")
        expect(marquee).to_have_css("opacity", "1")
        expect(track).to_have_css("color", "rgb(255, 255, 255)")
        self.assertTrue(track.locator("span").evaluate_all(
            "spans => spans.every(span => getComputedStyle(span).color === 'rgb(255, 255, 255)')"
        ))
        expect(track).to_have_css("animation-iteration-count", "infinite")
        if width >= 768:
            canvas_layer = page.get_by_test_id("webgl-canvas")
            expect(canvas_layer).to_be_attached()
            marquee.evaluate("bar => bar.scrollIntoView({block: 'center', behavior: 'instant'})")
            self.assertTrue(canvas_layer.evaluate("""layer => {
                const bar = layer.parentElement.querySelector('.studio-marquee');
                const {left, top, width, height} = bar.getBoundingClientRect();
                layer.style.pointerEvents = 'auto';
                try {
                    const elements = document.elementsFromPoint(left + width / 2, top + height / 2);
                    return elements.includes(layer) && elements.indexOf(bar) < elements.indexOf(layer)
                        && elements.includes(bar);
                } finally {
                    layer.style.removeProperty('pointer-events');
                }
            }"""))
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
