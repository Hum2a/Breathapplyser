from moviepy.editor import VideoFileClip
import numpy as np

def remove_black_background(frame):
    """Convert black background to transparent, retaining original colors."""
    # Ensure the frame has an alpha channel
    if frame.shape[2] == 3:  # Frame is RGB
        frame = np.dstack([frame, np.ones((frame.shape[0], frame.shape[1]), dtype='uint8') * 255])  # Add alpha=255
    
    # Identify black pixels (threshold can be adjusted)
    black_pixels_mask = np.all(frame[:, :, :3] <= [10, 10, 10], axis=-1)
    
    # Make identified pixels transparent
    frame[black_pixels_mask] = [0, 0, 0, 0]  # Set color and alpha to 0
    
    return frame

def process_video(input_path, output_path):
    clip = VideoFileClip(input_path)
    
    # Ensure the clip is converted to have an alpha layer
    clip = clip.fl_image(remove_black_background)
    
    # Write the output video
    clip.write_videofile(output_path, codec='libx264', ffmpeg_params=['-crf', '0', '-preset', 'veryslow', '-vf', "format=yuva420p"])

if __name__ == "__main__":
    input_video_path = "C:/Users/Humza/OneDrive/Documents/Programming/Apps/Breathapplyser/src/frontend/assets/animations/Sequence01.mp4"  # Update this path
    output_video_path = "C:/Users/Humza/OneDrive/Documents/Programming/Apps/Breathapplyser/src/frontend/assets/animations/output_video.mov"  # Update this path
    process_video(input_video_path, output_video_path)
