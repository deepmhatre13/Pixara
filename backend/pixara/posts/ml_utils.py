import joblib, os
BASE = os.path.dirname(__file__)
MODEL_PATH=os.path.join(BASE,'ml_models','comment_model.pkl')
comment_model=joblib.load(MODEL_PATH)
labels=['toxic','obscene','insult']
def predict_toxicity(text):
    pred=comment_model.predict([text])[0]
    return dict(zip(labels,map(int,pred)))
#comment_model = joblib.load(os.path.join(BASE, 'ml/comment_model.pkl'))
#score_model = joblib.load(os.path.join(BASE, 'ml/score_predictor.pkl'))
#bot_model = joblib.load(os.path.join(BASE, 'ml/bot_detector.pkl'))

#def predict_toxicity(text): return bool(comment_model.predict([text])[0])
#def predict_quality(text): return float(score_model.predict([text])[0])
#def detect_bot(text): return bool(bot_model.predict([text])[0])
