import os
import shutil
import random
from pathlib import Path

# Set random seed for reproducibility
random.seed(42)

# Paths
source_dir = Path("/Users/adamkhadre/Downloads/NurembergPolarBears")
images_dir = source_dir / "images"
labels_dir = source_dir / "labels"

# Target directories (relative to current directory)
target_base = Path(".")
train_images_dir = target_base / "images" / "train"
val_images_dir = target_base / "images" / "val"
train_labels_dir = target_base / "labels" / "train"
val_labels_dir = target_base / "labels" / "val"

# Create target directories
for dir_path in [train_images_dir, val_images_dir, train_labels_dir, val_labels_dir]:
    dir_path.mkdir(parents=True, exist_ok=True)
    print(f"Created directory: {dir_path}")

# Get all image files
image_files = sorted([f for f in os.listdir(images_dir) if f.endswith(('.jpg', '.jpeg', '.png'))])
print(f"\nFound {len(image_files)} images")

# Shuffle the files
random.shuffle(image_files)

# Calculate split index
split_idx = int(len(image_files) * 0.9)
train_files = image_files[:split_idx]
val_files = image_files[split_idx:]

print(f"Train set: {len(train_files)} images")
print(f"Validation set: {len(val_files)} images")

# Copy train files
print("\nCopying training files...")
for img_file in train_files:
    # Copy image
    src_img = images_dir / img_file
    dst_img = train_images_dir / img_file
    shutil.copy2(src_img, dst_img)

    # Copy corresponding label
    label_file = img_file.rsplit('.', 1)[0] + '.txt'
    src_label = labels_dir / label_file
    dst_label = train_labels_dir / label_file
    if src_label.exists():
        shutil.copy2(src_label, dst_label)

print(f"Copied {len(train_files)} training images and labels")

# Copy validation files
print("\nCopying validation files...")
for img_file in val_files:
    # Copy image
    src_img = images_dir / img_file
    dst_img = val_images_dir / img_file
    shutil.copy2(src_img, dst_img)

    # Copy corresponding label
    label_file = img_file.rsplit('.', 1)[0] + '.txt'
    src_label = labels_dir / label_file
    dst_label = val_labels_dir / label_file
    if src_label.exists():
        shutil.copy2(src_label, dst_label)

print(f"Copied {len(val_files)} validation images and labels")

print("\n✓ Dataset split complete!")
print(f"  Train: {len(train_files)} images → images/train/ & labels/train/")
print(f"  Val:   {len(val_files)} images → images/val/ & labels/val/")
