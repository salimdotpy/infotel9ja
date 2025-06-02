from flask import Flask, render_template_string
from google.cloud import firestore
import time, json

app = Flask(__name__)

# Initialize Firestore
db = firestore.Client.from_service_account_json("firebase-key.json")

# HTML Template with meta tags
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ siteTitle }}</title>
    <link rel="icon" type="image/svg+xml" href={{ favicon }} />
    <meta name="theme-color" content={{ siteColor }} />
    <meta name="description" content="{{ metaDescription }}">
    <meta name="keywords" content={{ metaKeyword }} />

    <meta property="og:type" content="website" />
    <meta property="og:title" content={{ socialTitle }} />
    <meta property="og:description" content={{ socialDescription }} />
    <meta property="og:image" content={{ seo }} />
    <meta property="og:image:width" content="800" />
    <meta property="og:image:height" content="600" />
    <meta property="og:image:alt" content="logo" />
    <meta property="og:url" content={{ url }} />
    <meta property="og:keywords" content={{ metaKeyword }} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={{ socialTitle }} />
    <meta name="twitter:description" content={{ socialDescription }} />
    <meta name="twitter:image" content={{ seo }} />
    <meta name="twitter:image:width" content="800" />
    <meta name="twitter:image:height" content="600" />
    <meta name="twitter:image:alt" content="logo" />
</head>
<body>
<p>Loading...</p>
<script>
window.location.href = "{{ url }}";
</script>
</body>
</html>
"""
meta_cache = {}  # { "articles:abc123": (timestamp, data) }
description = 'Join the Osun State Influential Personalities and Football Diehard Fans Contest, celebrating community engagement and social interaction in Osun State.'

def cache_data(key, data='', sec=600):
    now = time.time()
    # Check cache (valid for 10 mins)
    if key in meta_cache:
        timestamp, data = meta_cache[key]
        if now - timestamp < sec:
            return data
    meta_cache[key] = (now, data)
    return False

def toRgb(color):
    color = color.split()
    color = map(lambda c: hex(int(c))[2:] if int(c) > 9 else f'0{hex(int(c))[2:]}', color)
    return f"#{''.join(color)}"

@app.route("/seo")
def appSeo():
    url = "https://infotel9ja.vercel.app/"
    settings_col = db.collection('settings')
    if cache_data('system.data'):
        data = cache_data('system.data')
    else:
        query_ref = settings_col.where('data_keys', '==', 'system.data')
        docs = list(query_ref.stream())
        # for doc in docs:
        data_values = docs[0].to_dict().get('data_values')
        data = json.loads(data_values); data['siteColor'] = toRgb(data['siteColor'])
        cache_data('system.data', data)
    return render_template_string(
        HTML_TEMPLATE,
        siteTitle=data["siteTitle"],
        siteColor=data["siteColor"],
        metaDescription=data["metaDescription"],
        metaKeyword=data["metaKeyword"],
        socialTitle=data["socialTitle"],
        socialDescription=data["socialDescription"],
        seo=data["seo"],
        favicon=data["favicon"],
        url=url,
    )

@app.route("/contestant/<id>/<url>")
def contestantSeo(id, url):
    settings_col = db.collection('settings')
    if cache_data('system.data'):
        data = cache_data('system.data')
    else:
        query_ref = settings_col.where('data_keys', '==', 'system.data')
        docs = list(query_ref.stream())
        # for doc in docs:
        data_values = docs[0].to_dict().get('data_values')
        data = json.loads(data_values); data['siteColor'] = toRgb(data['siteColor'])
        cache_data('system.data', data)
    return render_template_string(
        HTML_TEMPLATE,
        siteTitle=data["siteTitle"],
        siteColor=data["siteColor"],
        metaDescription=data["metaDescription"],
        metaKeyword=data["metaKeyword"],
        socialTitle=data["socialTitle"],
        socialDescription=data["socialDescription"],
        seo=data["seo"],
        favicon=data["favicon"],
        url=url,
    )

@app.route("/")
def index():
    settings_col = db.collection('settings')
    query_ref = settings_col.where('data_keys', '==', 'system.data')
    docs = query_ref.stream(); dcc = []
    for doc in docs:
        data = doc.to_dict()
        data['data_values'] = json.loads(data.get('data_values'))
        dcc.append(data)
    return dcc
if __name__ == "__main__":
    app.run(debug=True)
