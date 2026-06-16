from PIL import Image, ImageDraw

def generate_battery_icon():
    # 24x24 pixels, transparent background
    img = Image.new('RGBA', (24, 24), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw a clean high-tech battery icon (semi-transparent light grey)
    # Battery body outline (rounded rect)
    draw.rounded_rectangle([2, 6, 18, 17], radius=2, outline=(220, 220, 220, 220), width=2)
    # Battery positive terminal cap
    draw.rounded_rectangle([19, 9, 21, 14], radius=1, fill=(220, 220, 220, 220))
    
    # Save the file
    out_path = 'assets/480x480-amazfit-balance/battery_icon.png'
    img.save(out_path, 'PNG')
    print(f"Saved battery icon to {out_path}")

if __name__ == '__main__':
    generate_battery_icon()
