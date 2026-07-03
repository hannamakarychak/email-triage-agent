import asyncio

from app.agent import root_agent


async def main():
    res = await root_agent.arun("My computer is broken!")
    print(res)

asyncio.run(main())
