from PIL import Image
import os
from colorama import init, Fore
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPM

def resize_image(image, size):
    return image.resize((size, size), Image.ANTIALIAS)

def save_image(image, filename):
    image.save(filename, "PNG")

def create_resized_images(source_image, output_folder):
    try:
        sizes = [16, 32, 48, 64, 96, 128]
        os.makedirs(output_folder, exist_ok=True)
        with Image.open(source_image) as image:
            # Copy original file in 256x256
            original_image = resize_image(image, 256)
            original_filename = os.path.join(output_folder, "icon256.png")
            save_image(original_image, original_filename)

            # Create resized images in different sizes
            for size in sizes:
                resized_image = resize_image(image, size)
                filename = os.path.join(output_folder, f"icon{size}.png")
                save_image(resized_image, filename)
    except FileNotFoundError:
        print(Fore.RED + "[X] The specified input file could not be found." + Fore.RESET)
        return False
    except OSError:
        print(Fore.RED + "[X] Error creating images. The input format may be invalid." + Fore.RESET)
        return False
    except Exception as e:
        print(Fore.RED + "[X] An error occurred:" + Fore.RESET, e)
        return False
    return True

def print_banner():
    banner = Fore.CYAN+r"""
   ____                _              _______
  / ___|___  ___ _ __ | |_ ___  _ __ |__   __|
 | |   / _ \/ _ \ '_ \| __/ _ \| '_ \  | |   
 | |__|  __/  __/ |_) | || (_) | | | | | |   
  \____\___|\___| .__/ \__\___/|_| |_| |_|   
                |_|

           Imagesize Converter
              2023 © S3R43o3
"""+Fore.RESET
    print(banner)


def main():
    try:
        init()
        print_banner()
        print(Fore.CYAN + "\n\t\t1) Resize .png\n\t\t2)Convert svg to png\n\t\t0) Exit\n" + Fore.RESET)
        option = int(input(Fore.YELLOW + "[?] Choose a Option:\n\t" + Fore.RESET))
        if option == 1:
            print(Fore.CYAN + "Your picture will be rezise to 16, 32, 48, 64, 96, 128 pixel!"+Fore.RESET)
            source_image = input(Fore.YELLOW + "[?] Please enter the path to the input file: " + Fore.RESET)
            output_name = input(Fore.YELLOW + "[?] Please enter the name of the output folder: " + Fore.RESET)
            output_folder = os.path.join("assets", "img", "icons", output_name)
            success = create_resized_images(source_image, output_folder)
            if success:
                print(Fore.GREEN + "[!] The images were created successfully." + Fore.RESET)
            else:
                print(
                    Fore.RED + "[X] An error occurred. Please check the input file and output folder." + Fore.RESET)
        elif option == 2:
            # Set the path to the SVG file
            svg_file = input(Fore.YELLOW + "[?] Please enter the path to the input file: " + Fore.RESET)
            png_file = input(Fore.YELLOW + "[?] Please enter the name of the .png: " + Fore.RESET)
            drawing = svg2rlg(svg_file)
            print(Fore.GREEN + "[!] The SVG file was successfully converted to PNG." + Fore.RESET)
            renderPM.drawToFile(drawing, png_file, fmt='PNG')
        else:
            raise ValueError

    except KeyboardInterrupt:
        print(Fore.YELLOW + "\n[!] Program was terminated by user. Goodbye!" + Fore.RESET)
    except Exception as e:
        print(Fore.RED + "[X] An error occurred:\n" + Fore.RESET, e)
    finally:
        exit()

if __name__ == "__main__":
    main()
