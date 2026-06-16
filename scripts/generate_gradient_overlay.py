import numpy as np
from PIL import Image

def generate_gradient():
    size = 480
    # Create coordinates grid
    x = np.arange(size)
    y = np.arange(size)
    xx, yy = np.meshgrid(x, y)
    
    # Calculate normalized diagonal distance (0 at top-left, 1 at bottom-right)
    d = (xx + yy) / (2 * (size - 1))
    
    # Apply a smooth power function so the top-left remains very clear,
    # and the bottom-right gets dark enough for text contrast.
    alpha = (np.power(d, 1.5) * 255).astype(np.uint8)
    
    # R, G, B are 0 (black), A is the calculated alpha
    arr = np.zeros((size, size, 4), dtype=np.uint8)
    arr[..., 3] = alpha
    
    img = Image.fromarray(arr, 'RGBA')
    out_path = 'assets/480x480-amazfit-balance/gradient_overlay.png'
    img.save(out_path, 'PNG')
    print(f"Saved gradient overlay to {out_path}")

if __name__ == '__main__':
    generate_gradient()
