import os
import shutil
import zipfile
import json

def zip_project_root(root_dir, output_dir):
    manifest_path = os.path.join(root_dir, 'manifest.json')
    with open(manifest_path, 'r') as manifest_file:
        manifest_data = json.load(manifest_file)
        version = manifest_data['version']
    zip_filename = f'LinkSafer-v{version}.zip'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    output_file = os.path.join(output_dir, zip_filename)
    with zipfile.ZipFile(output_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(root_dir):
            if 'tools' in dirs:
                dirs.remove('tools')
            if 'test' in dirs:
                dirs.remove('test')
            if '.git' in dirs:
                dirs.remove('.git')


            if os.path.samefile(root, output_dir):
                continue
            relative_path = os.path.relpath(root, root_dir)
            for file in files:
                file_path = os.path.join(root, file)
                if file == '.env' or file == '.gitignore':  # Exclude .env file
                    continue
                zip_path = os.path.join(relative_path, file)
                zipf.write(file_path, zip_path)
    print(f'The project successfully packaged with name: {zip_filename}!')

root_dir = '.'
output_dir = './package'

zip_project_root(root_dir, output_dir)
