import aiohttp


async def fetch_site_details(url):
    async with aiohttp.ClientSession() as client:
        try:
            async with client.get(url) as resp:
                text = await resp.text()
                return {"response_code": resp.status, "text": text}
        except:
            return {"response_code": "Сайт не доступен"}
