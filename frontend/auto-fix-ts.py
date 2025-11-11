#!/usr/bin/env python3
import re
import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).parent / "src"

def fix_file(filepath, fixes_to_apply):
    """Apply multiple fixes to a single file"""
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return False

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    changes_made = 0

    for fix in fixes_to_apply:
        if fix['type'] == 'remove_unused_import':
            # Remove unused import from import statement
            import_name = fix['name']
            # Pattern to match the import in the list
            pattern1 = rf',\s*{re.escape(import_name)}(?=\s*[,}}])'
            pattern2 = rf'{re.escape(import_name)}\s*,\s*'

            if re.search(pattern1, content):
                content = re.sub(pattern1, '', content)
                changes_made += 1
            elif re.search(pattern2, content):
                content = re.sub(pattern2, '', content)
                changes_made += 1

        elif fix['type'] == 'bracket_notation':
            # Fix: property.access -> property['access']
            prop = fix['property']
            obj = fix['object']
            pattern = rf'{re.escape(obj)}\.{re.escape(prop)}'
            replacement = f"{obj}['{prop}']"
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content)
                changes_made += 1

        elif fix['type'] == 'optional_chaining':
            # Add optional chaining where needed
            expr = fix['expression']
            prop = fix['property']
            pattern = rf'{re.escape(expr)}\.{re.escape(prop)}'
            replacement = f"{expr}?.{prop}"
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content)
                changes_made += 1

    if changes_made > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Applied {changes_made} fixes to {filepath}")
        return True

    return False

# Define all fixes by file
ALL_FIXES = {
    "app/dashboard/admin/users/[id]/page.tsx": [
        {'type': 'remove_unused_import', 'name': 'User'},
        {'type': 'remove_unused_import', 'name': 'GraduationCap'},
        {'type': 'remove_unused_import', 'name': 'FileText'},
        {'type': 'remove_unused_import', 'name': 'DollarSign'},
        {'type': 'remove_unused_import', 'name': 'Edit'},
        {'type': 'bracket_notation', 'object': 'badges', 'property': 'active'},
        {'type': 'optional_chaining', 'expression': 'badge', 'property': 'color'},
        {'type': 'optional_chaining', 'expression': 'badge', 'property': 'text'},
    ],
    "app/dashboard/applications/[id]/documents/page.tsx": [
        {'type': 'remove_unused_import', 'name': 'router'},
        {'type': 'bracket_notation', 'object': 'params', 'property': 'id'},
        {'type': 'bracket_notation', 'object': 'badge', 'property': 'pending'},
        {'type': 'optional_chaining', 'expression': 'badge', 'property': 'color'},
        {'type': 'optional_chaining', 'expression': 'badge', 'property': 'text'},
    ],
    "app/dashboard/applications/[id]/edit/page.tsx": [
        {'type': 'remove_unused_import', 'name': 'AlertCircle'},
        {'type': 'bracket_notation', 'object': 'params', 'property': 'id'},
    ],
    "app/dashboard/applications/new/page.tsx": [
        {'type': 'remove_unused_import', 'name': 'AlertCircle'},
    ],
    "app/dashboard/layout.tsx": [
        {'type': 'remove_unused_import', 'name': 'router'},
    ],
}

# Apply all fixes
for file_path, fixes in ALL_FIXES.items():
    full_path = BASE_DIR / file_path
    fix_file(str(full_path), fixes)

print("\nAll fixes applied!")
