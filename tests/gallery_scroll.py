"""Browser regression checks for the multipage editorial experience."""
from pathlib import Path
import os
import unittest
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
                        if width in [390, 1440] and path != "/inexistente":
                            Path("test-results").mkdir(exist_ok=True)
                            page.screenshot(path="test-results/" + str(width) + "-" + (path.strip("/").replace("/", "-") or "inicio") + ".png", full_page=True)
                    page.goto(base + "/portfolio")
                    expect(page.locator(".editorial-gallery article")).to_have_count(8)
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
                    page.goto(base + "/servicos/fox")
                    page.get_by_role("button", name="Consultar este procedimento").click()
                    expect(page.locator("#booking-service")).to_have_value("srv-fox")
                    expect(page.get_by_role("button", name="Continuar para WhatsApp")).to_be_disabled()
                    page.keyboard.press("Escape")
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


if __name__ == "__main__":
    unittest.main()
