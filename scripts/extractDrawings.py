import fitz
import os
import json

pdf_path = r"D:\CATALOGUE 2026-sorted.pdf"
doc = fitz.open(pdf_path)
output_dir = r"client\public\drawings"
os.makedirs(output_dir, exist_ok=True)

# Category drawing mapping (category slug -> page 0-indexed)
category_pages = {
    "flat-bars": 1,
    "round-bars-rods": 3,
    "square-bars": 4,
    "angles": 7,
    "u-channels": 10,
    "rectangle-tubes": 11,
    "pipes-tubes": 18,
    "square-tubes": 21,
    "door-window-sections": 28,
    "sliding-sections": 43,
    "slim-profiles": 56,
    "domal-sections": 63,
    "curtain-walls": 65,
    "railing-profiles": 119,
    "solar-profiles": 159
}

print("Rendering high-res category drawing sheets...")
for slug, page_idx in category_pages.items():
    if page_idx < len(doc):
        page = doc[page_idx]
        pix = page.get_pixmap(dpi=150)
        img_name = f"cat_{slug}.png"
        img_path = os.path.join(output_dir, img_name)
        pix.save(img_path)
        print(f"Saved: {img_name} ({pix.width}x{pix.height})")

print("\nExtracting product drawings...")
# Read extracted products
seed_file = r"server\seeds\seedData.json"
with open(seed_file, "r", encoding="utf-8") as f:
    data = json.load(f)

# Update products and categories to use the real drawing URLs!
updated_categories = []
for cat in data["categories"]:
    cat_slug = cat["slug"]
    drawing_url = f"/drawings/cat_{cat_slug}.png"
    cat["image"] = drawing_url
    cat["drawingImage"] = drawing_url
    updated_categories.append(cat)

updated_products = []
for p in data["products"]:
    cat_slug = p["categorySlug"]
    drawing_url = f"/drawings/cat_{cat_slug}.png"
    # Keep the drawing as the primary visual and add secondary
    p["images"] = [drawing_url]
    p["drawingUrl"] = drawing_url
    p["catalogPage"] = category_pages.get(cat_slug, 1) + 1
    updated_products.append(p)

data["categories"] = updated_categories
data["products"] = updated_products

with open(seed_file, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print(f"Updated {len(updated_products)} products with exact drawing paths in seedData.json")

# Update client fallbackData.js
fallback_file = r"client\src\data\fallbackData.js"
with open(fallback_file, "w", encoding="utf-8") as f:
    f.write(f"// Official 2026 Catalogue Drawings and Products\nexport const fallbackCategories = {json.dumps(updated_categories, indent=2)};\n\nexport const fallbackProducts = {json.dumps(updated_products, indent=2)};\n")

print("Updated fallbackData.js successfully!")
