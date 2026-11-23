"""Run against a Vite preview with Playwright Chromium installed."""
import os
import unittest

from playwright.sync_api import expect, sync_playwright


class GalleryScrollTest(unittest.TestCase):
    def test_scroll(self):
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(channel="chrome")
            for width, height, mobile in [(1440, 900, False), (390, 844, True)]:
                with self.subTest(width=width):
                    page = browser.new_page(viewport={"width": width, "height": height},
                                            is_mobile=mobile, has_touch=mobile)
                    page.goto(os.environ["PREVIEW_URL"], wait_until="domcontentloaded")
                    section = page.locator("#clientes")
                    rail = section.locator(".portfolio-rail")
                    stage = section.locator(".portfolio-stage")
                    count = section.locator(".portfolio-progress")
                    expect(rail.locator("article")).to_have_count(8)
                    expect(page.locator(".pin-spacer > #clientes")).to_have_count(1)
                    page.evaluate("() => document.fonts.ready")
                    section.evaluate("el => window.scrollTo({top: scrollY + el.getBoundingClientRect().top, behavior:'instant'})")
                    travel = rail.evaluate("el => el.scrollWidth - document.documentElement.clientWidth")
                    def advance(pixels):
                        page.evaluate("(top) => scrollBy({top, behavior:'instant'})", pixels)
                    def left():
                        return rail.evaluate("el => el.getBoundingClientRect().left")
                    initial_left = left()
                    initial_top = stage.bounding_box()["y"]
                    advance(travel / 2)
                    expect(count).to_contain_text(" / 08")
                    page.wait_for_function("x => document.querySelector('.portfolio-rail').getBoundingClientRect().left < x", arg=initial_left - travel / 3)
                    # During the tween, each original portrait must fill its frame edge to edge.
                    for photo in rail.locator(".portfolio-photo img").all():
                        geometry = photo.evaluate("""img => {
                          const frame = img.parentElement.getBoundingClientRect();
                          const rect = img.getBoundingClientRect();
                          return [rect.x-frame.x, rect.y-frame.y, rect.width-frame.width,
                                  rect.height-frame.height, rect.height-rect.width*img.getAttribute('height')/img.getAttribute('width')];
                        }""")
                        for difference in geometry:
                            self.assertLess(abs(difference), 1)
                    self.assertAlmostEqual(stage.bounding_box()["y"], initial_top, delta=2)
                    advance(travel)
                    expect(count).to_have_text("08 / 08")
                    page.wait_for_function('''() => {
                      const c = document.querySelector('.portfolio-booking').getBoundingClientRect();
                      return c.right <= innerWidth && c.left >= 0;
                    }''')
                    self.assertLess(stage.bounding_box()["y"], initial_top - 20)
                    advance(-travel)
                    expect(count).not_to_have_text("08 / 08")
                    self.assertAlmostEqual(stage.bounding_box()["y"], initial_top, delta=2)
                    page.emulate_media(reduced_motion="reduce")
                    expect(page.locator(".pin-spacer > #clientes")).to_have_count(0)
                    expect(rail).to_have_css("display", "grid")
                    search = section.get_by_role("searchbox")
                    search.fill("henna")
                    expect(rail.locator("article")).to_have_count(1)
                    page.emulate_media(reduced_motion="no-preference")
                    expect(rail).to_have_css("display", "grid")
                    expect(page.locator(".pin-spacer > #clientes")).to_have_count(0)
                    search.fill("")
                    expect(page.locator(".pin-spacer > #clientes")).to_have_count(1)
                    page.close()
            browser.close()


if __name__ == "__main__":
    unittest.main()
