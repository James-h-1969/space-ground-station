from src.database import db
import json


class PayloadData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.String(64), nullable=False)
    data = db.Column(db.Text, nullable=False)  # JSON string storing the list

    def set_data(self, data_list):
        assert len(data_list) == 18
        self.data = json.dumps(data_list)

    def get_data(self):
        return json.loads(self.data)
