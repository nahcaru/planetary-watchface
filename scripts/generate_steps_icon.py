from PIL import Image, ImageDraw

def generate_step_icon():
    # 24x24 pixels, transparent background
    img = Image.new('RGBA', (24, 24), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw a clean high-tech footprint (semi-transparent light grey)
    # Sole front
    draw.ellipse([4, 8, 11, 15], fill=(220, 220, 220, 220))
    # Heel
    draw.ellipse([5, 16, 10, 21], fill=(220, 220, 220, 220))
    # Toes
    draw.ellipse([3, 4, 5, 6], fill=(220, 220, 220, 220))
    draw.ellipse([6, 3, 8, 5], fill=(220, 220, 220, 220))
    draw.ellipse([9, 4, 11, 6], fill=(220, 220, 220, 220))
    draw.ellipse([12, 6, 14, 8], fill=(220, 220, 220, 220))
    
    # Save the file
    out_path = 'assets/480x480-amazfit-balance/steps_icon.png'
    img.save(out_path, 'PNG')
    print(f"Saved steps icon to {out_path}")

if __name__ == '__main__':
    generate_step_icon()
