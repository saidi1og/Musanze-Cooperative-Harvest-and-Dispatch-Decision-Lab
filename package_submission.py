"""Submission Packaging Utility for Musanze Cooperative Decision Lab.
Creates AI_A1_G09.zip strictly conforming to INES Ruhengeri submission structure.
"""

import os
import zipfile
import shutil

PROHIBITED_SUBSTRINGS = ["__pycache__", ".venv", "venv", ".ipynb_checkpoints", ".git", ".DS_Store"]


def should_include(rel_path: str) -> bool:
    for prohibited in PROHIBITED_SUBSTRINGS:
        if prohibited in rel_path:
            return False
    return True


def package_directory(source_dir: str, zip_filename: str):
    os.makedirs(os.path.join(source_dir, "artifacts"), exist_ok=True)
    os.makedirs(os.path.join(source_dir, "models"), exist_ok=True)

    # Sync artifacts from root artifacts/
    for folder in ["artifacts", "models"]:
        root_folder = folder
        target_folder = os.path.join(source_dir, folder)
        if os.path.exists(root_folder):
            for item in os.listdir(root_folder):
                s = os.path.join(root_folder, item)
                d = os.path.join(target_folder, item)
                if os.path.isfile(s):
                    shutil.copy2(s, d)

    print(f"Packaging {source_dir} into {zip_filename}...")
    with zipfile.ZipFile(zip_filename, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            dirs[:] = [d for d in dirs if should_include(d)]
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, start=os.path.dirname(source_dir) or ".")
                if should_include(rel_path):
                    zipf.write(full_path, rel_path)

    size_mb = os.path.getsize(zip_filename) / (1024 * 1024)
    print(f"Created {zip_filename} successfully ({size_mb:.2f} MB).")


def create_submission_zips():
    # Primary Package AI_A1_G09.zip
    if os.path.exists("AI_A1_G09"):
        package_directory("AI_A1_G09", "AI_A1_G09.zip")


if __name__ == "__main__":
    create_submission_zips()
