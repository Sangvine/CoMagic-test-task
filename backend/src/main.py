import aiohttp
from aiohttp import web
import asyncio


async def fetch(client):
    url = 'https://dataapi.comagic.ru/v2.0'
    headers = {'Content-Type': 'application/json; charset=UTF-8'}
    json = {
        "jsonrpc": "2.0",
        "id": "number",
        "method": "get.sites",
        "params": {
            "access_token": "vy7m6ggz45gek4xrxc4i0mvof0gjoemys2efze8n",
        }
    }
    async with client.post(url, headers=headers, json=json) as resp:
        assert resp.status == 200
        return await resp.json()


async def hello(request):
    text = "Hello, world!"
    return web.Response(text=text)


async def get_sites(request):
    #data = "Hello, world!!"
    data = []
    async with aiohttp.ClientSession() as client:
        html = await fetch(client)
        data.append(html)

    return web.json_response(data)


async def get_site_details(request):
    data = "Hello, world!!"
    return web.json_response(data)

app = web.Application()
routes = [web.get('/', hello),
          web.get('/api/get_sites', get_sites),
          web.get('/api/get_site_details', get_site_details)
          ]

app.add_routes(routes)
web.run_app(app)
