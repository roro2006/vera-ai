import cv2
import streamlink
from ultralytics import YOLO

# 1. Load your trained model
model = YOLO("runs/detect/train/weights/best.pt") 

# 2. YouTube Live URL (e.g., a zoo's live feed)
youtube_url = "https://www.youtube.com/watch?v=BSUnBPvX9K4"

# runs/detect/train/weights/best.pt
def get_stream_url(url):
    streams = streamlink.streams(url)
    if not streams:
        raise ValueError("No streams found for this URL.")
    # 'best' gets the highest quality, you can use '720p' for better performance
    return streams['best'].to_url()

# 3. Initialize VideoCapture with the live stream URL
stream_url = get_stream_url(youtube_url)
cap = cv2.VideoCapture(stream_url)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        print("Stream ended or failed to read.")
        break

    # 4. Run Inference (stream=True for lower memory usage on long feeds)
    results = model(frame, stream=True, device="mps")

    for r in results:
        annotated_frame = r.plot()

    # 5. Display the result
    cv2.imshow("YouTube Live Polar Bear Tracker", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()