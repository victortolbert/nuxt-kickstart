#!/usr/bin/env python3
"""Verify the Design Tokens Transformer page layout and components."""

from playwright.sync_api import sync_playwright
import sys

def verify_tokens_page():
    """Verify the tokens page renders correctly with all expected elements."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            print("Navigating to tokens page...")
            page.goto('http://localhost:3000/examples/design-tokens')
            page.wait_for_load_state('networkidle')

            print("Taking screenshot...")
            page.screenshot(path='/tmp/tokens-page.png', full_page=True)

            # Verify page title
            print("\n✓ Checking page title...")
            title = page.locator('h1').first.text_content()
            assert title == 'Design Tokens Transformer', f"Expected 'Design Tokens Transformer', got '{title}'"
            print(f"  Title: {title}")

            # Verify description
            print("\n✓ Checking page description...")
            description = page.locator('h1 + p').text_content()
            assert 'Transform Design Tokens JSON files' in description
            print(f"  Description found")

            # Verify Help button
            print("\n✓ Checking Help button...")
            help_button = page.locator('button:has-text("Help")')
            assert help_button.is_visible()
            print("  Help button visible")

            # Verify Input card
            print("\n✓ Checking Input section...")
            input_card = page.locator('text=Input').first
            assert input_card.is_visible()
            print("  Input card visible")

            # Verify Output card
            print("\n✓ Checking Output section...")
            output_card = page.locator('text=Output').first
            assert output_card.is_visible()
            print("  Output card visible")

            # Verify History section
            print("\n✓ Checking History section...")
            history_card = page.locator('text=History').first
            assert history_card.is_visible()
            print("  History card visible")

            # Verify Saved Configurations section
            print("\n✓ Checking Saved Configurations section...")
            config_card = page.locator('text=Saved Configurations').first
            assert config_card.is_visible()
            print("  Saved Configurations card visible")

            # Verify two-column layout on desktop
            print("\n✓ Checking layout structure...")
            # Set viewport to desktop size
            page.set_viewport_size({"width": 1280, "height": 720})
            page.wait_for_timeout(500)  # Allow layout to adjust

            # Check that cards are in a grid
            grid = page.locator('.grid.grid-cols-1.lg\\:grid-cols-2').first
            assert grid.is_visible()
            print("  Desktop two-column layout detected")

            print("\n✅ All verification checks passed!")
            print(f"\nScreenshot saved to: /tmp/tokens-page.png")

        except AssertionError as e:
            print(f"\n❌ Verification failed: {e}")
            sys.exit(1)
        except Exception as e:
            print(f"\n❌ Error during verification: {e}")
            sys.exit(1)
        finally:
            browser.close()

if __name__ == '__main__':
    verify_tokens_page()
