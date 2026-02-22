from ultralytics import YOLO
import cv2

model = YOLO("runs/detect/train/weights/best.pt")


# "runs/detect/train/weights/best.pt"

# A dictionary to lock a Track ID to a specific name
# Format: {track_id: "Name"}
bear_assignments = {}

cap = cv2.VideoCapture("media/kcfeed.mov")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret: break

    results = model.track(frame, persist=True, tracker="botsort.yaml", device="mps")

    for r in results:
        if r.boxes.id is not None:
            # Get coordinates, IDs, and classes
            boxes = r.boxes.xyxy.int().cpu().tolist()
            track_ids = r.boxes.id.int().cpu().tolist()
            cls_indices = r.boxes.cls.int().cpu().tolist()

            for box, track_id, cls_idx in zip(boxes, track_ids, cls_indices):
                # 1. Identity Logic (Your existing logic)
                if track_id not in bear_assignments:
                    name = model.names[cls_idx] + f" (id: {cls_idx})"
                    if name not in bear_assignments.values():
                        bear_assignments[track_id] = name
                    else:
                        bear_assignments[track_id] = "Nanuq (id: 0)" if name == "Nanuq (id: 0)" else "Nanuq (id: 0)"

                # 2. Get the custom name
                custom_label = bear_assignments[track_id]
                x1, y1, x2, y2 = box

                # draw bounding box
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

                # draw text
                label_text = f"{custom_label}"
                cv2.putText(frame, label_text, (x1, y1 - 10), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

    # 5. Display the frame we manually drew on
    cv2.imshow("Nuremberg Zoo - Custom Tracker", frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'): break

cap.release()
cv2.destroyAllWindows()