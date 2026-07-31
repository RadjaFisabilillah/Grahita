from PIL import Image, ImageDraw
import math

def create_icon(size):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background rounded rect (deep forest green)
    radius = int(size * 0.25)
    bg_color = (11, 73, 58)  # #0b493a
    
    # Draw rounded rectangle background
    def draw_rounded_rect(draw, xy, radius, fill):
        x1, y1, x2, y2 = xy
        draw.rounded_rectangle(xy, radius=radius, fill=fill)
    
    draw_rounded_rect(draw, (0, 0, size-1, size-1), radius, bg_color)
    
    # Leaf shape (lime color)
    leaf_color = (234, 240, 106)  # #eaf06a
    center_x = size // 2
    center_y = size // 2
    leaf_height = int(size * 0.55)
    leaf_width = int(size * 0.35)
    
    # Draw leaf as an ellipse
    leaf_bbox = [
        center_x - leaf_width//2,
        center_y - leaf_height//2,
        center_x + leaf_width//2,
        center_y + leaf_height//2
    ]
    draw.ellipse(leaf_bbox, fill=leaf_color)
    
    # Stem
    stem_width = max(1, int(size * 0.04))
    stem_top = center_y - leaf_height//2 + int(size * 0.08)
    stem_bottom = center_y + leaf_height//2 - int(size * 0.08)
    draw.line(
        [(center_x, stem_top), (center_x, stem_bottom)],
        fill=bg_color,
        width=stem_width
    )
    
    # Vein (V shape)
    vein_y = center_y + int(size * 0.05)
    vein_length = int(size * 0.12)
    draw.line(
        [(center_x - vein_length, vein_y - vein_length//2), (center_x, vein_y), (center_x + vein_length, vein_y - vein_length//2)],
        fill=bg_color,
        width=stem_width
    )
    
    return img

# Generate icons
icon_192 = create_icon(192)
icon_192.save('public/icon-192x192.png')

icon_512 = create_icon(512)
icon_512.save('public/icon-512x512.png')

print("Icons generated successfully!")
