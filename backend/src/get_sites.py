from random import randint
import aiohttp


async def fetch_sites(token):
    url = 'https://dataapi.comagic.ru/v2.0'
    headers = {'Content-Type': 'application/json; charset=UTF-8'}
    json = {
        "jsonrpc": "2.0",
        "id": randint(0, 100000),
        "method": "get.sites",
        "params": {
            "access_token": token,
        }
    }
    async with aiohttp.ClientSession() as client:
        async with client.post(url, headers=headers, json=json) as resp:
            assert resp.status == 200
            return await resp.json()
