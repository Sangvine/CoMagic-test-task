import aiohttp
from aiohttp import web
import asyncio
import re


async def fetch_get_sites(token=None):
    url = 'https://dataapi.comagic.ru/v2.0'
    _token = token if token else "vy7m6ggz45gek4xrxc4i0mvof0gjoemys2efze8n"
    headers = {'Content-Type': 'application/json; charset=UTF-8'}
    json = {
        "jsonrpc": "2.0",
        "id": "0",
        "method": "get.sites",
        "params": {
            "access_token": _token,
        }
    }
    async with aiohttp.ClientSession() as client:
        async with client.post(url, headers=headers, json=json) as resp:
            assert resp.status == 200
            return await resp.json()


async def fetch_site_details(url):
    async with aiohttp.ClientSession() as client:
        try:
            async with client.get(url) as resp:
                assert resp.status == 200, "страница не отвечает"
                return await resp.text()
        except AssertionError as error:
            print(error.args[0])
            return ""
        except:
            return "404"


async def hello(request):
    text = "Hello, world!"
    return web.Response(text=text)


async def get_sites(request):
    data = await fetch_get_sites(request.rel_url.query.get('token', ''))

    result = []
    if data.get("result", {}).get("data", None):
        for item in data["result"]["data"]:
            result.append({"site_key": item["site_key"],
                           "domain_name": item["domain_name"]})
    elif data["error"]:
        result.append({"error": data["error"]})
    else:
        result.append("error")

    return web.json_response(result)


async def get_site_details(request):
    site_key = request.rel_url.query.get('site_key', '')
    cs_min = "cs.min.js"
    domain_name = request.rel_url.query.get('domain_name', '')
    text = await fetch_site_details("http://" + domain_name + "/")
    is_cs_min = re.search(cs_min, text)
    is_site_key = re.search(site_key, text)
    result = {"404": "false", "cs.min.js": bool(is_cs_min),
              "is_site_key": bool(is_site_key)}
    return web.json_response(result)

app = web.Application()
routes = [web.get('/', hello),
          web.get('/api/get_sites', get_sites),
          web.get('/api/get_site_details', get_site_details)
          ]

app.add_routes(routes)
web.run_app(app)
