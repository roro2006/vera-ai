import cv2
import yt_dlp
from ultralytics import YOLO

# Load a generic model or specify your path
model = YOLO("runs/detect/train/weights/best.pt") 

# YouTube URL
youtube_url = "https://www.youtube.com/watch?v=7nr3VQ0xrVo"

# Use yt-dlp to get the stream URL
ydl_opts = {"format": "best"}
with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    info = ydl.extract_info(youtube_url, download=False)
    stream_url = info["url"]

cap = cv2.VideoCapture(stream_url)

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        break

    # Run inference
    results = model(frame)

    # Visualize
    annotated_frame = results[0].plot()
    cv2.imshow("YOLO YouTube Inference", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()