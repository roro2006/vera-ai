from ultralytics import YOLO


model = YOLO("runs/detect/train/weights/last.pt") 


model.train(
    resume=True
)