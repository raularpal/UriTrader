
import os

files = ['index.html', 'sistema.html', 'roadmap.html', 'faq.html']

def main():
    for file in files:
        if not os.path.exists(file):
            print(f"Skipping {file} (Not found)")
            continue
            
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix floating CTA link
        # Replaces generic href to roadmap#pricing
        new_content = content.replace('href="precios.html"', 'href="roadmap.html#pricing"')
        
        # Also clean up any potential href="roadmap.html#pricing" that might have been partially formed if I ran partial updates
        # Actually my consolidate script did replace some.
        # But index.html had `href="precios.html"` in the footer cta.
        
        if content != new_content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {file}")
        else:
            print(f"No changes needed for {file}")

if __name__ == "__main__":
    main()
