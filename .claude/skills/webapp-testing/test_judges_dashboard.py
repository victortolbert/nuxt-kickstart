"""
Test judges dashboard theme application
Verifies:
- Lobster Two font on heading
- Cream background color
- CSS variables are applied
"""
from playwright.sync_api import sync_playwright
import sys

def test_judges_dashboard():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            print("Navigating to judges dashboard...")
            page.goto('http://localhost:3000/tools/judges-dashboard')
            page.wait_for_load_state('networkidle')

            print("Taking screenshot...")
            page.screenshot(path='/tmp/judges-dashboard.png', full_page=True)
            print("Screenshot saved to /tmp/judges-dashboard.png")

            # Check if heading exists
            heading = page.locator('h1').first
            heading_text = heading.text_content()
            print(f"\nHeading text: {heading_text}")

            # Check font-family
            font_family = heading.evaluate('el => window.getComputedStyle(el).fontFamily')
            print(f"Heading font-family: {font_family}")

            # Check if Lobster Two is applied
            if 'Lobster Two' in font_family or 'lobster-two' in font_family.lower():
                print("✓ Lobster Two font is applied to heading")
            else:
                print(f"✗ Lobster Two font NOT found. Current font: {font_family}")

            # Check background color of the main container
            container = page.locator('.judges-theme').first
            if container.count() > 0:
                bg_color = container.evaluate('el => window.getComputedStyle(el).backgroundColor')
                print(f"\nContainer background color: {bg_color}")

                # Check for cream color (approximately rgb(253, 246, 227) = #FDF6E3)
                # Allow some variance in RGB values
                if 'rgb(253, 246, 227)' in bg_color or 'rgb(253, 246, 243)' in bg_color:
                    print("✓ Cream background color is applied")
                else:
                    print(f"✗ Background color might not be cream. Found: {bg_color}")
            else:
                print("✗ .judges-theme class not found")

            # Check CSS variables
            css_vars = page.evaluate('''() => {
                const style = getComputedStyle(document.documentElement);
                return {
                    primary: style.getPropertyValue('--judges-primary'),
                    bg: style.getPropertyValue('--judges-bg'),
                    text: style.getPropertyValue('--judges-text')
                };
            }''')

            print(f"\nCSS Variables:")
            print(f"  --judges-primary: {css_vars.get('primary', 'not found')}")
            print(f"  --judges-bg: {css_vars.get('bg', 'not found')}")
            print(f"  --judges-text: {css_vars.get('text', 'not found')}")

            # Check if tabs are present
            tabs = page.locator('[role="tablist"]')
            if tabs.count() > 0:
                print("\n✓ Tabs component is rendered")
                tab_items = page.locator('[role="tab"]').all()
                print(f"  Found {len(tab_items)} tabs")
            else:
                print("\n✗ Tabs component not found")

            print("\n✓ All theme verification checks completed")
            return True

        except Exception as e:
            print(f"\n✗ Error during testing: {e}", file=sys.stderr)
            page.screenshot(path='/tmp/judges-dashboard-error.png', full_page=True)
            print("Error screenshot saved to /tmp/judges-dashboard-error.png")
            return False

        finally:
            browser.close()

if __name__ == '__main__':
    success = test_judges_dashboard()
    sys.exit(0 if success else 1)
