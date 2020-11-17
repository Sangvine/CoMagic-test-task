import aiohttp
from aiohttp import web
import asyncio
import re
from get_sites import fetch_sites
from get_site_details import fetch_site_details


async def get_sites(request):
    data = await fetch_sites(request.rel_url.query.get('token', ''))
    result = []
    if data.get("result", {}).get("data", None):
        for item in data["result"]["data"]:
            result.append({"site_key": item["site_key"],
                           "domain_name": item["domain_name"]})
    elif data["error"]:
        result.append({"error": data["error"]})
    else:
        result.append({"error": "Необработанное исключение"})
    return web.json_response(result)


async def get_site_details(request):
    site_key = request.rel_url.query.get('site_key', '')
    domain_name = request.rel_url.query.get('domain_name', '')
    request_results = await fetch_site_details("http://" + domain_name + "/")
    response_code = request_results["response_code"]
    if "text" in request_results:
        text = request_results["text"]
        is_js_file = re.search("cs.min.js", text)
        is_site_key = re.search(site_key, text)
        result = {"responseCode": response_code, "isJsFile": bool(is_js_file),
                  "isSiteKey": bool(is_site_key)}
    else:
        result = {"responseCode": response_code, "isJsFile": None,
                  "isSiteKey": None}
    return web.json_response(result)


app = web.Application()
routes = [web.get('/api/get_sites', get_sites),
          web.get('/api/get_site_details', get_site_details)
          ]

app.add_routes(routes)
web.run_app(app)
