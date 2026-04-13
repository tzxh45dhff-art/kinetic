"""
Kinetic Finance — Stock Data Router
Provides real-time NSE stock quotes via yfinance.
GET /api/stocks/search?q=REL    — search Nifty 50 constituents
GET /api/stocks/quotes?symbols=RELIANCE.NS,TCS.NS  — batch quotes
"""
import time
import asyncio
from typing import Optional
from fastapi import APIRouter, Query

router = APIRouter(prefix="/api/stocks", tags=["stocks"])

# ── Nifty 50 constituents (symbol → metadata) ────────────────────────────────

NIFTY_50 = [
    {"symbol": "RELIANCE", "name": "Reliance Industries", "sector": "Energy & Retail"},
    {"symbol": "HDFCBANK", "name": "HDFC Bank", "sector": "Banking"},
    {"symbol": "INFY", "name": "Infosys", "sector": "Technology"},
    {"symbol": "ICICIBANK", "name": "ICICI Bank", "sector": "Banking"},
    {"symbol": "TCS", "name": "Tata Consultancy Services", "sector": "Technology"},
    {"symbol": "BHARTIARTL", "name": "Bharti Airtel", "sector": "Telecom"},
    {"symbol": "AXISBANK", "name": "Axis Bank", "sector": "Banking"},
    {"symbol": "LT", "name": "Larsen & Toubro", "sector": "Infrastructure"},
    {"symbol": "KOTAKBANK", "name": "Kotak Mahindra Bank", "sector": "Banking"},
    {"symbol": "BAJFINANCE", "name": "Bajaj Finance", "sector": "NBFC"},
    {"symbol": "WIPRO", "name": "Wipro", "sector": "Technology"},
    {"symbol": "HCLTECH", "name": "HCL Technologies", "sector": "Technology"},
    {"symbol": "MARUTI", "name": "Maruti Suzuki", "sector": "Automobile"},
    {"symbol": "ASIANPAINT", "name": "Asian Paints", "sector": "Consumer"},
    {"symbol": "SUNPHARMA", "name": "Sun Pharmaceutical", "sector": "Pharma"},
    {"symbol": "TITAN", "name": "Titan Company", "sector": "Consumer"},
    {"symbol": "ULTRACEMCO", "name": "UltraTech Cement", "sector": "Materials"},
    {"symbol": "NESTLEIND", "name": "Nestle India", "sector": "FMCG"},
    {"symbol": "POWERGRID", "name": "Power Grid Corp", "sector": "Utilities"},
    {"symbol": "NTPC", "name": "NTPC", "sector": "Utilities"},
    {"symbol": "ONGC", "name": "ONGC", "sector": "Energy"},
    {"symbol": "TECHM", "name": "Tech Mahindra", "sector": "Technology"},
    {"symbol": "HINDALCO", "name": "Hindalco Industries", "sector": "Materials"},
    {"symbol": "JSWSTEEL", "name": "JSW Steel", "sector": "Materials"},
    {"symbol": "TATACONSUM", "name": "Tata Consumer Products", "sector": "FMCG"},
    {"symbol": "ADANIPORTS", "name": "Adani Ports", "sector": "Infrastructure"},
    {"symbol": "BAJAJFINSV", "name": "Bajaj Finserv", "sector": "Financial Services"},
    {"symbol": "DRREDDY", "name": "Dr. Reddys Laboratories", "sector": "Pharma"},
    {"symbol": "CIPLA", "name": "Cipla", "sector": "Pharma"},
    {"symbol": "EICHERMOT", "name": "Eicher Motors", "sector": "Automobile"},
]

# ── Cache ─────────────────────────────────────────────────────────────────────

_quote_cache: dict[str, dict] = {}  # symbol -> {data, ts}
CACHE_TTL = 300  # 5 minutes


def _fetch_quote(symbol: str) -> Optional[dict]:
    """Fetch a single stock quote from yfinance. Returns None on failure."""
    import yfinance as yf

    now = time.time()
    cached = _quote_cache.get(symbol)
    if cached and (now - cached["ts"]) < CACHE_TTL:
        return cached["data"]

    try:
        tk = yf.Ticker(f"{symbol}.NS")
        info = tk.info or {}
        hist_1y = tk.history(period="1y")

        current_price = info.get("currentPrice") or info.get("regularMarketPrice") or 0
        previous_close = info.get("previousClose") or info.get("regularMarketPreviousClose") or current_price

        # 1-year ago price
        year_ago_price = current_price
        if not hist_1y.empty and len(hist_1y) > 5:
            year_ago_price = hist_1y["Close"].iloc[0]

        change_1d = ((current_price - previous_close) / previous_close * 100) if previous_close else 0
        change_1y = ((current_price - year_ago_price) / year_ago_price * 100) if year_ago_price else 0

        data = {
            "symbol": symbol,
            "currentPrice": round(current_price, 2),
            "previousClose": round(previous_close, 2),
            "yearAgoPrice": round(year_ago_price, 2),
            "change1D": round(change_1d, 1),
            "change1Y": round(change_1y, 1),
            "sector": info.get("sector", ""),
            "marketCap": info.get("marketCap", 0),
            "name": info.get("longName", symbol),
        }

        _quote_cache[symbol] = {"data": data, "ts": now}
        return data

    except Exception as e:
        print(f"[stocks] Failed to fetch {symbol}: {e}")
        return None


def _search_constituents(query: str) -> list[dict]:
    """Search Nifty 50 constituents by name or symbol."""
    q = query.lower()
    return [
        s for s in NIFTY_50
        if q in s["symbol"].lower() or q in s["name"].lower()
    ][:10]


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("/search")
async def search_stocks(q: str = Query("", min_length=1)):
    """Search Nifty 50 stocks and return live quotes for matches."""
    matches = _search_constituents(q)
    if not matches:
        return {"results": []}

    loop = asyncio.get_event_loop()
    results = []
    for match in matches:
        quote = await loop.run_in_executor(None, _fetch_quote, match["symbol"])
        if quote:
            results.append({**match, **quote})
        else:
            # Return metadata even without live quote
            results.append(match)

    return {"results": results}


@router.get("/quotes")
async def get_stock_quotes(symbols: str = Query("", description="Comma-separated NSE symbols")):
    """Batch fetch quotes for multiple symbols."""
    if not symbols.strip():
        return {"quotes": []}

    symbol_list = [s.strip().replace(".NS", "") for s in symbols.split(",") if s.strip()]
    loop = asyncio.get_event_loop()
    results = []

    for sym in symbol_list[:10]:  # Cap at 10 to prevent abuse
        quote = await loop.run_in_executor(None, _fetch_quote, sym)
        if quote:
            results.append(quote)

    return {"quotes": results}
