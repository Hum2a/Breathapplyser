from moviepy.editor import VideoFileClip
from PIL import Image
import numpy as np
import os

def remove_black_background(frame):
    # Convert the image to an array
    img_array = np.array(frame)
    
    # Convert image to RGBA (if it's not already in that format)
    if img_array.shape[2] == 3:  # No alpha channel
        img_array = np.dstack((img_array, np.ones((img_array.shape[0], img_array.shape[1], 1), dtype=img_array.dtype) * 255))

    # Set a threshold for what is considered 'black'
    threshold = 50  # You may need to adjust this threshold
    mask = (img_array[:, :, 0] > threshold) | (img_array[:, :, 1] > threshold) | (img_array[:, :, 2] > threshold)

    # Set the alpha channel to 0 for all black pixels
    img_array[:, :, 3] = mask * 255

    # Convert the array back to an image
    new_frame = Image.fromarray(img_array, 'RGBA')
    return new_frame

def split_video_into_frames(video_path, output_dir):
    # Load the video file
    clip = VideoFileClip(video_path)
    
    # Create the output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Iterate through each frame in the video
    for i, frame in enumerate(clip.iter_frames()):
        # Process the frame to remove the black background
        processed_frame = remove_black_background(frame)
        
        # Construct the output frame file path
        frame_file_path = os.path.join(output_dir, f"frame_{i+1:01d}.png")
        
        # Save the processed frame as an image file with transparency
        processed_frame.save(frame_file_path)
        print(f"Saved {frame_file_path}")

if __name__ == "__main__":
    video_path = "C:/Users/Humza/OneDrive/Documents/Programming/Apps/Breathapplyser/src/frontend/assets/animations/BeerAnimation.mov"  # Update this path to your video file
    output_dir = "C:/Users/Humza/OneDrive/Documents/Programming/Apps/Breathapplyser/src/frontend/assets/animations/beerFrames"  # Update this path to where you want to save the frames
    split_video_into_frames(video_path, output_dir)
