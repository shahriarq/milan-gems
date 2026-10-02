//+------------------------------------------------------------------+
//|                                            MTF_SMC_Gold_EA.mq5   |
//|  MTF Price Action / Smart Money EA for XAUUSD (M5 + H1/H4 bias) |
//|                                                                  |
//|  Flow (all evaluated on closed bars only - no repainting):       |
//|   1. HTF bias  : Price > EMA50 > EMA200 (bull) / mirror (bear)   |
//|   2. Setup     : Consolidation -> displacement candle with FVG   |
//|                  -> origin candle (swing high/low before impulse)|
//|   3. Orders    : 2 limit orders sharing one SL                   |
//|                  Order1 (small lot, 1:1)  Order2 (bigger, 1:2)   |
//|   4. Management: Order1 -> BE once Order2 is filled,             |
//|                  Order2 -> BE at +1R, unfilled orders expire.    |
//|                                                                  |
//|  REQUIRES a HEDGING account (two positions per symbol).          |
//+------------------------------------------------------------------+
#property copyright "milan-gems"
#property version   "1.00"
#property strict

#include <Trade\Trade.mqh>

//--- selectable level definitions
enum ENUM_ENTRY1_MODE
  {
   ENTRY1_FT_WICK = 0,   // Follow-through candle extreme wick (High for sell / Low for buy)
   ENTRY1_FT_OPEN = 1    // Follow-through candle open
  };

enum ENUM_ENTRY2_MODE
  {
   ENTRY2_DISP_50      = 0, // 50% of the displacement (breakout) candle
   ENTRY2_ORIGIN_BODY  = 1  // Origin candle base (body edge nearest the range)
  };

//+------------------------------------------------------------------+
//| Inputs                                                           |
//+------------------------------------------------------------------+
input group "=== General ==="
input ENUM_TIMEFRAMES    InpExecTF            = PERIOD_M5;    // Execution timeframe
input ENUM_TIMEFRAMES    InpHtfTF             = PERIOD_H1;    // HTF bias timeframe (H1 or H4)
input ulong              InpMagicOrder1       = 770001;       // Magic number - Order 1
input ulong              InpMagicOrder2       = 770002;       // Magic number - Order 2
input int                InpSlippagePoints    = 30;           // Max slippage / deviation (points)
input int                InpMaxSpreadPoints   = 60;           // Skip new setups above this spread (0 = off)

input group "=== HTF trend (EMA) ==="
input int                InpEmaFast           = 50;           // Fast EMA period
input int                InpEmaSlow           = 200;          // Slow EMA period

input group "=== Setup detection (execution TF) ==="
input int                InpAtrPeriod         = 14;           // ATR period
input int                InpConsMinBars       = 5;            // Consolidation: min bars
input int                InpConsMaxBars       = 10;           // Consolidation: max bars
input double             InpCompressionMult   = 2.0;          // Compression: range < ATR * this
input double             InpDispBodyAtrMult   = 1.0;          // Displacement: body >= ATR * this
input double             InpDispBodyRatio     = 0.60;         // Displacement: body / candle range >= this
input int                InpOriginLookback    = 3;            // Origin candle: search last N consolidation bars
input double             InpMaxRiskAtr        = 4.0;          // Skip setup if SL distance > ATR * this (0 = off)

input group "=== Entries ==="
input ENUM_ENTRY1_MODE   InpEntry1Mode        = ENTRY1_FT_WICK;     // Order 1 level
input ENUM_ENTRY2_MODE   InpEntry2Mode        = ENTRY2_DISP_50;     // Order 2 level
input double             InpLots1             = 0.01;         // Order 1 lot size
input double             InpLots2             = 0.02;         // Order 2 lot size
input double             InpRR1               = 1.0;          // Order 1 take-profit R:R
input double             InpRR2               = 2.0;          // Order 2 take-profit R:R
input int                InpSLBufferPoints    = 20;           // Extra SL buffer beyond origin extreme (points)
input int                InpExpirationBars    = 20;           // Cancel unfilled orders after N execution bars

input group "=== Trade management ==="
input int                InpBEBufferPoints    = 10;           // Break-even buffer (points, spread is added on top)
input double             InpOrder2BeAtR       = 1.0;          // Move Order 2 to BE at this R multiple

//+------------------------------------------------------------------+
//| Constants                                                        |
//+------------------------------------------------------------------+
#define COMMENT_ORDER1 "Setup_Order1"
#define COMMENT_ORDER2 "Setup_Order2"

//+------------------------------------------------------------------+
//| Raw output of the setup detector (direction + candle levels)     |
//+------------------------------------------------------------------+
struct SSetup
  {
   int      dir;            // +1 buy, -1 sell
   double   ftHigh, ftLow, ftOpen;   // follow-through candle levels
   double   disp50;         // 50% of displacement candle
   double   originBody;     // origin candle body edge (sell: lower edge, buy: upper edge)
   double   originExtreme;  // origin candle extreme (sell: high, buy: low)
   double   atr;            // ATR measured before the impulse
  };

//+------------------------------------------------------------------+
//| CHtfTrend : EMA50/EMA200 bias on the higher timeframe            |
//+------------------------------------------------------------------+
class CHtfTrend
  {
private:
   string          m_sym;
   ENUM_TIMEFRAMES m_tf;
   int             m_slowPeriod;
   int             m_hFast, m_hSlow;
public:
                   CHtfTrend() : m_hFast(INVALID_HANDLE), m_hSlow(INVALID_HANDLE) {}
                  ~CHtfTrend()
     {
      if(m_hFast != INVALID_HANDLE) IndicatorRelease(m_hFast);
      if(m_hSlow != INVALID_HANDLE) IndicatorRelease(m_hSlow);
     }

   bool Init(const string sym, ENUM_TIMEFRAMES tf, int fast, int slow)
     {
      m_sym = sym; m_tf = tf; m_slowPeriod = slow;
      m_hFast = iMA(sym, tf, fast, 0, MODE_EMA, PRICE_CLOSE);
      m_hSlow = iMA(sym, tf, slow, 0, MODE_EMA, PRICE_CLOSE);
      return (m_hFast != INVALID_HANDLE && m_hSlow != INVALID_HANDLE);
     }

   // +1 bullish, -1 bearish, 0 neutral / data not ready. Uses the last CLOSED HTF bar.
   int Bias()
     {
      if(iBars(m_sym, m_tf) < m_slowPeriod + 5) return 0;
      if(BarsCalculated(m_hFast) < 2 || BarsCalculated(m_hSlow) < 2) return 0;
      double f[1], s[1];
      if(CopyBuffer(m_hFast, 0, 1, 1, f) != 1) return 0;
      if(CopyBuffer(m_hSlow, 0, 1, 1, s) != 1) return 0;
      double close = iClose(m_sym, m_tf, 1);
      if(close <= 0.0) return 0;
      if(close > f[0] && f[0] > s[0]) return  1;
      if(close < f[0] && f[0] < s[0]) return -1;
      return 0;
     }
  };

//+------------------------------------------------------------------+
//| CSetupDetector : consolidation -> displacement + FVG -> origin  |
//|                                                                  |
//| Bar map (series index, 1 = last closed bar):                     |
//|   [1] follow-through candle (closes the 3-candle FVG pattern)    |
//|   [2] displacement / breakout candle                             |
//|   [3..] consolidation, [3] is the candle right before impulse    |
//| SELL FVG: Low[3] > High[1]     BUY FVG: High[3] < Low[1]         |
//+------------------------------------------------------------------+
class CSetupDetector
  {
private:
   string          m_sym;
   ENUM_TIMEFRAMES m_tf;
   int             m_hAtr;
public:
                   CSetupDetector() : m_hAtr(INVALID_HANDLE) {}
                  ~CSetupDetector() { if(m_hAtr != INVALID_HANDLE) IndicatorRelease(m_hAtr); }

   bool Init(const string sym, ENUM_TIMEFRAMES tf, int atrPeriod)
     {
      m_sym = sym; m_tf = tf;
      m_hAtr = iATR(sym, tf, atrPeriod);
      return (m_hAtr != INVALID_HANDLE);
     }

   // Looks for a setup in direction 'dir' (the HTF bias). Returns true and fills 'out'.
   bool Detect(const int dir, SSetup &out)
     {
      const int minBars = MathMax(1, InpConsMinBars);
      const int maxBars = MathMax(minBars, InpConsMaxBars);
      const int need    = 3 + maxBars;

      if(iBars(m_sym, m_tf) < need + InpAtrPeriod + 5) return false;
      if(BarsCalculated(m_hAtr) < need) return false;

      MqlRates r[];
      ArraySetAsSeries(r, true);
      if(CopyRates(m_sym, m_tf, 0, need + 1, r) < need + 1) return false;

      // ATR before the impulse (shift 3) so the displacement candle does not inflate it
      double atrBuf[1];
      if(CopyBuffer(m_hAtr, 0, 3, 1, atrBuf) != 1 || atrBuf[0] <= 0.0) return false;
      const double atr = atrBuf[0];

      const MqlRates disp = r[2];
      const MqlRates ft   = r[1];

      //--- displacement candle: strong, directional, with real body
      const double body  = (disp.close - disp.open) * dir;     // positive when in trade direction
      const double range = disp.high - disp.low;
      if(range <= 0.0)                       return false;
      if(body < atr * InpDispBodyAtrMult)    return false;
      if(body / range < InpDispBodyRatio)    return false;

      //--- Fair Value Gap across candles [3],[2],[1]
      if(dir < 0 && !(r[3].low  > ft.high)) return false;
      if(dir > 0 && !(r[3].high < ft.low))  return false;

      //--- consolidation: grow the window back from bar 3, accept the first
      //    window that is compressed and fully broken by the displacement close
      double hi = -DBL_MAX, lo = DBL_MAX;
      int found = 0;
      for(int n = 1; n <= maxBars; n++)
        {
         const int idx = 3 + n - 1;
         hi = MathMax(hi, r[idx].high);
         lo = MathMin(lo, r[idx].low);
         if(n < minBars) continue;
         if((hi - lo) >= atr * InpCompressionMult) break;      // window no longer compressed
         const bool broke = (dir < 0) ? (disp.close < lo) : (disp.close > hi);
         if(broke) { found = n; break; }
        }
      if(found == 0) return false;

      //--- origin candle: sell -> highest high, buy -> lowest low among the last few range bars
      const int look = MathMin(found, MathMax(1, InpOriginLookback));
      int oi = 3;
      for(int k = 3; k < 3 + look; k++)
        {
         if(dir < 0 && r[k].high > r[oi].high) oi = k;
         if(dir > 0 && r[k].low  < r[oi].low)  oi = k;
        }

      out.dir           = dir;
      out.ftHigh        = ft.high;
      out.ftLow         = ft.low;
      out.ftOpen        = ft.open;
      out.disp50        = (disp.high + disp.low) * 0.5;
      out.originBody    = (dir < 0) ? MathMin(r[oi].open, r[oi].close) : MathMax(r[oi].open, r[oi].close);
      out.originExtreme = (dir < 0) ? r[oi].high : r[oi].low;
      out.atr           = atr;
      return true;
     }
  };

//+------------------------------------------------------------------+
//| COrderManager : placement, expiry and break-even management      |
//+------------------------------------------------------------------+
class COrderManager
  {
private:
   string  m_sym;
   CTrade  m_trade;

   double  MinDistance() const
     {
      long stops  = SymbolInfoInteger(m_sym, SYMBOL_TRADE_STOPS_LEVEL);
      long freeze = SymbolInfoInteger(m_sym, SYMBOL_TRADE_FREEZE_LEVEL);
      return (double)MathMax(stops, freeze) * SymbolInfoDouble(m_sym, SYMBOL_POINT);
     }

   double  NormPrice(const double p) const
     { return NormalizeDouble(p, (int)SymbolInfoInteger(m_sym, SYMBOL_DIGITS)); }

   double  NormLot(const double lots) const
     {
      double step = SymbolInfoDouble(m_sym, SYMBOL_VOLUME_STEP);
      double mn   = SymbolInfoDouble(m_sym, SYMBOL_VOLUME_MIN);
      double mx   = SymbolInfoDouble(m_sym, SYMBOL_VOLUME_MAX);
      if(step <= 0.0) step = mn;
      double l = MathFloor(lots / step + 1e-8) * step;
      return NormalizeDouble(MathMax(mn, MathMin(mx, l)), 8);
     }

   bool    Done() const
     {
      uint rc = m_trade.ResultRetcode();
      return (rc == TRADE_RETCODE_DONE || rc == TRADE_RETCODE_PLACED);
     }

   // Sends one pending limit order; returns order ticket or 0 on failure.
   ulong   SendLimit(const int dir, const ulong magic, const double lots, const double price,
                     const double sl, const double tp, const string comment)
     {
      m_trade.SetExpertMagicNumber(magic);
      bool ok = (dir > 0)
                ? m_trade.BuyLimit (lots, price, m_sym, sl, tp, ORDER_TIME_GTC, 0, comment)
                : m_trade.SellLimit(lots, price, m_sym, sl, tp, ORDER_TIME_GTC, 0, comment);
      if(!ok || !Done())
        {
         PrintFormat("[%s] order failed: retcode=%u (%s)", comment, m_trade.ResultRetcode(), m_trade.ResultRetcodeDescription());
         return 0;
        }
      return m_trade.ResultOrder();
     }

   // Find our open position by magic; returns ticket or 0.
   ulong   FindPosition(const ulong magic, const string comment) const
     {
      for(int i = PositionsTotal() - 1; i >= 0; i--)
        {
         ulong t = PositionGetTicket(i);
         if(t == 0) continue;
         if(PositionGetString(POSITION_SYMBOL) != m_sym) continue;
         if((ulong)PositionGetInteger(POSITION_MAGIC) != magic) continue;
         if(StringFind(PositionGetString(POSITION_COMMENT), comment) < 0) continue;
         return t;
        }
      return 0;
     }

   // Move SL of a selected position to break-even (+buffer) if valid and an improvement.
   void    MoveToBreakeven(const ulong ticket)
     {
      if(!PositionSelectByTicket(ticket)) return;
      const long   type  = PositionGetInteger(POSITION_TYPE);
      const double open  = PositionGetDouble(POSITION_PRICE_OPEN);
      const double sl    = PositionGetDouble(POSITION_SL);
      const double tp    = PositionGetDouble(POSITION_TP);
      const double bid   = SymbolInfoDouble(m_sym, SYMBOL_BID);
      const double ask   = SymbolInfoDouble(m_sym, SYMBOL_ASK);
      const double buf   = (ask - bid) + InpBEBufferPoints * SymbolInfoDouble(m_sym, SYMBOL_POINT);
      const double minD  = MinDistance();

      if(type == POSITION_TYPE_BUY)
        {
         double nsl = NormPrice(open + buf);
         if(sl != 0.0 && sl >= nsl) return;                 // already at/after BE
         if(bid - nsl < minD) return;                       // price not far enough yet - retry later
         if(!m_trade.PositionModify(ticket, nsl, tp) || !Done())
            PrintFormat("BE modify failed (buy #%I64u): %u", ticket, m_trade.ResultRetcode());
        }
      else
        {
         double nsl = NormPrice(open - buf);
         if(sl != 0.0 && sl <= nsl) return;
         if(nsl - ask < minD) return;
         if(!m_trade.PositionModify(ticket, nsl, tp) || !Done())
            PrintFormat("BE modify failed (sell #%I64u): %u", ticket, m_trade.ResultRetcode());
        }
     }

public:
   void Init(const string sym)
     {
      m_sym = sym;
      m_trade.SetDeviationInPoints(InpSlippagePoints);
      m_trade.SetTypeFillingBySymbol(sym);
      m_trade.SetAsyncMode(false);
     }

   // True if any position/pending order of this EA exists on the symbol.
   bool HasActiveSetup() const
     {
      for(int i = PositionsTotal() - 1; i >= 0; i--)
        {
         if(PositionGetTicket(i) == 0) continue;
         ulong mg = (ulong)PositionGetInteger(POSITION_MAGIC);
         if(PositionGetString(POSITION_SYMBOL) == m_sym && (mg == InpMagicOrder1 || mg == InpMagicOrder2)) return true;
        }
      for(int i = OrdersTotal() - 1; i >= 0; i--)
        {
         if(OrderGetTicket(i) == 0) continue;
         ulong mg = (ulong)OrderGetInteger(ORDER_MAGIC);
         if(OrderGetString(ORDER_SYMBOL) == m_sym && (mg == InpMagicOrder1 || mg == InpMagicOrder2)) return true;
        }
      return false;
     }

   // Convert detected candle levels into the two limit orders. Returns true if placed.
   bool PlaceSetup(const SSetup &s)
     {
      const int    dir    = s.dir;
      const double bid    = SymbolInfoDouble(m_sym, SYMBOL_BID);
      const double ask    = SymbolInfoDouble(m_sym, SYMBOL_ASK);
      const double point  = SymbolInfoDouble(m_sym, SYMBOL_POINT);
      const double minD   = MinDistance();

      // Entry levels
      double e1 = (InpEntry1Mode == ENTRY1_FT_OPEN) ? s.ftOpen : (dir > 0 ? s.ftLow : s.ftHigh);
      double e2 = (InpEntry2Mode == ENTRY2_ORIGIN_BODY) ? s.originBody : s.disp50;

      // Common SL: beyond origin extreme. A sell SL is closed by the Ask, so add the spread.
      double sl = (dir > 0) ? s.originExtreme - InpSLBufferPoints * point
                            : s.originExtreme + InpSLBufferPoints * point + (ask - bid);

      e1 = NormPrice(e1); e2 = NormPrice(e2); sl = NormPrice(sl);

      // Geometry (positive = in "buy direction", dir flips it for sells):
      //   price -> e1 (retrace) -> e2 (deeper) -> SL
      const double ref = (dir > 0) ? ask : bid;
      if((ref - e1) * dir < minD)  { Print("Setup skipped: Order1 level not valid vs. price/stop level"); return false; }
      if((e1 - e2) * dir <= 0.0)   { Print("Setup skipped: Order2 level not deeper than Order1");        return false; }
      if((e2 - sl) * dir < minD)   { Print("Setup skipped: SL too close to Order2 level");                return false; }

      const double risk1 = MathAbs(e1 - sl);
      const double risk2 = MathAbs(e2 - sl);
      if(InpMaxRiskAtr > 0.0 && risk1 > s.atr * InpMaxRiskAtr) { Print("Setup skipped: risk exceeds ATR cap"); return false; }

      const double tp1 = NormPrice(e1 + dir * risk1 * InpRR1);
      const double tp2 = NormPrice(e2 + dir * risk2 * InpRR2);

      ulong t1 = SendLimit(dir, InpMagicOrder1, NormLot(InpLots1), e1, sl, tp1, COMMENT_ORDER1);
      if(t1 == 0) return false;
      ulong t2 = SendLimit(dir, InpMagicOrder2, NormLot(InpLots2), e2, sl, tp2, COMMENT_ORDER2);
      if(t2 == 0)
        {
         m_trade.OrderDelete(t1);                           // keep the pair atomic
         return false;
        }
      PrintFormat("Setup placed (%s): E1=%.2f E2=%.2f SL=%.2f TP1=%.2f TP2=%.2f",
                  dir > 0 ? "BUY" : "SELL", e1, e2, sl, tp1, tp2);
      return true;
     }

   // Cancel pending orders older than InpExpirationBars execution bars.
   void ExpirePending()
     {
      if(InpExpirationBars <= 0) return;
      const long maxAge = (long)InpExpirationBars * PeriodSeconds(InpExecTF);
      for(int i = OrdersTotal() - 1; i >= 0; i--)
        {
         ulong t = OrderGetTicket(i);
         if(t == 0) continue;
         if(OrderGetString(ORDER_SYMBOL) != m_sym) continue;
         ulong mg = (ulong)OrderGetInteger(ORDER_MAGIC);
         if(mg != InpMagicOrder1 && mg != InpMagicOrder2) continue;
         if(TimeCurrent() - (datetime)OrderGetInteger(ORDER_TIME_SETUP) >= maxAge)
           {
            m_trade.OrderDelete(t);
            PrintFormat("Pending order #%I64u expired after %d bars", t, InpExpirationBars);
           }
        }
     }

   // Called every tick: synchronized BE for Order 1 and +1R BE for Order 2.
   void ManagePositions()
     {
      ulong p2 = FindPosition(InpMagicOrder2, COMMENT_ORDER2);
      if(p2 == 0) return;

      // Order 1 -> BE as soon as Order 2 is live. If Order 1 is still in drawdown the
      // modify is not yet valid (SL would sit on the wrong side of price), so it is
      // retried each tick and applied the moment price returns to profit.
      ulong p1 = FindPosition(InpMagicOrder1, COMMENT_ORDER1);
      if(p1 != 0) MoveToBreakeven(p1);

      // Order 2 -> BE after InpOrder2BeAtR * initial risk. Risk = TP distance / RR2 (stateless).
      if(!PositionSelectByTicket(p2)) return;
      const double open = PositionGetDouble(POSITION_PRICE_OPEN);
      const double tp   = PositionGetDouble(POSITION_TP);
      if(tp == 0.0 || InpRR2 <= 0.0) return;
      const double risk = MathAbs(tp - open) / InpRR2;
      const bool   buy  = (PositionGetInteger(POSITION_TYPE) == POSITION_TYPE_BUY);
      const double px   = buy ? SymbolInfoDouble(m_sym, SYMBOL_BID) : SymbolInfoDouble(m_sym, SYMBOL_ASK);
      const double prof = buy ? (px - open) : (open - px);
      if(prof >= risk * InpOrder2BeAtR) MoveToBreakeven(p2);
     }
  };

//+------------------------------------------------------------------+
//| Globals                                                          |
//+------------------------------------------------------------------+
CHtfTrend      g_trend;
CSetupDetector g_detector;
COrderManager  g_orders;
datetime       g_lastBar = 0;

// True once per new execution-TF bar (evaluate on the just-closed bar [1]).
bool IsNewBar()
  {
   datetime t = iTime(_Symbol, InpExecTF, 0);
   if(t == 0 || t == g_lastBar) return false;
   g_lastBar = t;
   return true;
  }

//+------------------------------------------------------------------+
int OnInit()
  {
   if(AccountInfoInteger(ACCOUNT_MARGIN_MODE) != ACCOUNT_MARGIN_MODE_RETAIL_HEDGING)
     {
      Print("This EA needs a HEDGING account (Order 1 and Order 2 must coexist).");
      return INIT_FAILED;
     }
   if(InpHtfTF <= InpExecTF) { Print("HTF must be higher than the execution timeframe."); return INIT_PARAMETERS_INCORRECT; }
   if(InpMagicOrder1 == InpMagicOrder2) { Print("Magic numbers must differ."); return INIT_PARAMETERS_INCORRECT; }
   if(!g_trend.Init(_Symbol, InpHtfTF, InpEmaFast, InpEmaSlow)) return INIT_FAILED;
   if(!g_detector.Init(_Symbol, InpExecTF, InpAtrPeriod))       return INIT_FAILED;
   g_orders.Init(_Symbol);
   g_lastBar = iTime(_Symbol, InpExecTF, 0);   // do not act on the bar that is open at start
   return INIT_SUCCEEDED;
  }

//+------------------------------------------------------------------+
void OnTick()
  {
   g_orders.ManagePositions();                 // cheap, tick-based management

   if(!IsNewBar()) return;                     // everything below runs on bar close only

   g_orders.ExpirePending();

   if(g_orders.HasActiveSetup()) return;       // one setup at a time
   if(InpMaxSpreadPoints > 0 && SymbolInfoInteger(_Symbol, SYMBOL_SPREAD) > InpMaxSpreadPoints) return;

   const int bias = g_trend.Bias();
   if(bias == 0) return;

   SSetup s;
   if(g_detector.Detect(bias, s))
      g_orders.PlaceSetup(s);
  }
//+------------------------------------------------------------------+
