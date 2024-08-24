import requests
from mfrc522 import SimpleMFRC522
import json
import RPi.GPIO as GPIO
GPIO.setwarnings(False)
reader = SimpleMFRC522()

url_get = "http://10.106.23.143:3001/data/get-all-attendances"  # URL để lấy tất cả dữ liệu
url_post = "http://10.106.23.143:3001/data/add-attendances"  # URL để gửi dữ liệu

print("Đặt thẻ RFID lên đầu đọc...")
try:
    card_id, text = reader.read()
    card_exist=False

    # Lấy tất cả dữ liệu hiện tại từ API
    response = requests.get(url_get)

    if response.status_code == 200:
        # Kiểm tra xem card_id đã tồn tại hay chưa
        attendances = response.json().get("data", [])
        for attendance in attendances:
            if attendance['card_id']  == str(card_id):
                card_exist=True
                break
        if card_exist:
            print(f"Card ID {card_id} đã tồn tại.")
        else:
            # Nếu card_id chưa tồn tại, gửi yêu cầu POST để thêm vào
            student_id = input("Nhập student_id: ")
            student_name = input("Nhập Tên: ")
            data =[
                card_id,
                student_id,
                student_name
            ]
            post_response = requests.post(url_post, json=data)
            if post_response.status_code == 200:
                print("Thành công:", post_response.json())
            else:
                print(f"Lỗi: {post_response.status_code}, Chi tiết: {post_response.text}")
    else:
        print(f"Lỗi khi lấy dữ liệu: {response.status_code}, Chi tiết: {response.text}")

except Exception as e:
    print("Đã xảy ra lỗi:", e)
