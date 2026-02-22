from ultralytics import YOLO
import cv2
import os

# 1. Load both models
bear_model = YOLO("ml/runs/detect/train/weights/best.pt")
human_model = YOLO("yolo11n.pt") 

# Dictionary for bear identity locking
bear_assignments = {}

# 2. Setup Input and Output
input_path = "ml/media/kcfeed.mov"
output_path = "ml/media/processed_output.mp4"

cap = cv2.VideoCapture(input_path)

# Get video properties for the exporter
frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = int(cap.get(cv2.CAP_PROP_FPS))

# 3. Initialize Video Writer
# 'mp4v' is the standard codec for Mac/Windows compatibility
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))

print(f"Starting export... Saving to {output_path}")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret: break

    # 4. Run both models
    bear_results = bear_model.track(frame, persist=True, tracker="botsort.yaml", device="mps")
    human_results = human_model.predict(frame, classes=[0], device="mps", conf=0.4)

    # 5. Handle Bear Detections (Identity Locking)
    for r in bear_results:
        if r.boxes.id is not None:
            boxes = r.boxes.xyxy.int().cpu().tolist()
            track_ids = r.boxes.id.int().cpu().tolist()
            cls_indices = r.boxes.cls.int().cpu().tolist()

            for box, track_id, cls_idx in zip(boxes, track_ids, cls_indices):
                if track_id not in bear_assignments:
                    name = bear_model.names[cls_idx]
                    if name not in bear_assignments.values():
                        bear_assignments[track_id] = name
                    else:
                        # Logic to force the other name if one is taken
                        bear_assignments[track_id] = "Nanuq" if "Vera" in bear_assignments.values() else "Vera"

                label = bear_assignments[track_id]
                x1, y1, x2, y2 = box
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

    # 6. Handle Human Detections (Zookeeper)
    for r in human_results:
        boxes = r.boxes.xyxy.int().cpu().tolist()
        for box in boxes:
            hx1, hy1, hx2, hy2 = box
            cv2.rectangle(frame, (hx1, hy1), (hx2, hy2), (255, 0, 0), 2)
            cv2.putText(frame, "Zookeeper", (hx1, hy1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 0), 2)

    # 7. WRITE THE PROCESSED FRAME TO THE NEW FILE
    out.write(frame)

    # Show progress (optional - you can comment this out to run faster)
    cv2.imshow("Nuremberg Zoo - Multi-Model Tracker", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'): break

# 8. CRITICAL: Release both cap and out
cap.release()
out.release()
cv2.destroyAllWindows()

print(f"Export finished successfully! File saved at: {output_path}")