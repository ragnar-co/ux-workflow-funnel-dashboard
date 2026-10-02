import { signed, getNpsLevel } from "../domain/nps.js";

export { getNpsLevel };

const LEVEL_BADGE_STYLE = {
  risk: "bg-ragnar-red-soft text-ragnar-red",
  neutral: "bg-brand-amber-soft text-brand-amber",
  good: "bg-brand-green-soft text-brand-green",
  excellent: "bg-brand-blue-soft text-brand-blue"
};

const SEGMENT_STYLE = {
  risk: "bg-ragnar-red-soft",
  neutral: "bg-brand-amber-soft",
  good: "bg-brand-green-soft",
  excellent: "bg-brand-blue-soft"
};

const SCALE_SEGMENTS = [
  { tone: "risk", label: "Risk", from: -100, to: 0 },
  { tone: "neutral", label: "Neutral", from: 0, to: 30 },
  { tone: "good", label: "Good", from: 30, to: 70 },
  { tone: "excellent", label: "Excellent", from: 70, to: 100 }
];

const CATEGORY_CHIP_STYLE = {
  promoter: "bg-brand-green-soft text-brand-green",
  passive: "bg-brand-amber-soft text-brand-amber",
  detractor: "bg-ragnar-red-soft text-ragnar-red"
};

const LEVEL_LABEL_TH = {
  risk: "ที่มีความเสี่ยง",
  neutral: "ปานกลาง",
  good: "ดี",
  excellent: "ดีเยี่ยม"
};

export function buildNpsInsight({ total, promoters, passives, detractors, detractorRate, levelTone }) {
  if (!total) {
    return {
      insight: "ยังไม่มีคำตอบที่พร้อมใช้งานสำหรับคำนวณ NPS",
      action: "แก้ไขแถวที่ถูกตีธง หรือนำเข้าคำตอบเพิ่มเติมเพื่อดูผลวิเคราะห์"
    };
  }
  if (detractors === 0 && passives > 0) {
    return {
      insight: "ไม่มี Detractor เลย โอกาสหลักตอนนี้คือการดันกลุ่ม Passive ให้กลายเป็น Promoter",
      action: "ติดตามกลุ่ม Passive และสอบถามว่าอะไรจะทำให้พวกเขาให้คะแนน 9–10"
    };
  }
  if (detractors === 0 && passives === 0) {
    return {
      insight: "ผู้ตอบทุกคนเป็น Promoter ถือเป็นผลลัพธ์ที่ดีที่สุด",
      action: "ขอ referral, case study หรือรีวิวจากกลุ่ม Promoter เพื่อต่อยอด"
    };
  }
  if (detractorRate >= 20) {
    return {
      insight: `Detractor คิดเป็น ${detractorRate}% ของผู้ตอบทั้งหมด ซึ่งฉุดคะแนนโดยรวมลง`,
      action: "ติดตาม Detractor เป็นลำดับแรกภายใน 24–48 ชั่วโมง เพื่อหาสาเหตุและแก้ไข"
    };
  }
  return {
    insight: `คะแนน NPS อยู่ในระดับ${LEVEL_LABEL_TH[levelTone]} แต่ยังมี Detractor ${detractors} ราย และมีกลุ่ม Passive ที่สามารถพัฒนาให้เป็น Promoter ได้`,
    action: "ติดตาม Detractor ก่อนเพื่อหาสาเหตุและแนวทางแก้ไข จากนั้นสอบถามกลุ่ม Passive ว่าอะไรจะทำให้ให้คะแนนเป็น 9–10"
  };
}

function NpsScale({ nps }) {
  const markerLeft = Math.min(100, Math.max(0, ((nps + 100) / 200) * 100));
  return (
    <div className="mt-4">
      <div className="relative h-2.5 rounded-full overflow-hidden flex">
        {SCALE_SEGMENTS.map((seg) => (
          <div key={seg.tone} className={SEGMENT_STYLE[seg.tone]} style={{ width: `${((seg.to - seg.from) / 200) * 100}%` }} />
        ))}
        <div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-brand-blue ring-2 ring-white shadow"
          style={{ left: `calc(${markerLeft}% - 6px)` }}
          title={`Current NPS: ${signed(nps)}`}
        />
      </div>
      <div className="relative mt-1 h-4">
        <span
          className="absolute -translate-x-1/2 text-[10px] font-extrabold text-brand-blue whitespace-nowrap"
          style={{ left: `${markerLeft}%` }}
        >
          {signed(nps)}
        </span>
      </div>
      <div className="flex text-[10px] font-extrabold uppercase tracking-wider text-[#475569] mt-2">
        {SCALE_SEGMENTS.map((seg) => (
          <span key={seg.tone} className="text-center" style={{ width: `${((seg.to - seg.from) / 200) * 100}%` }}>
            {seg.label}
          </span>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-[#64748B] mt-0.5">
        <span>-100</span>
        <span>+100</span>
      </div>
    </div>
  );
}

export function NpsInsightCard({ summary }) {
  const { total, nps, promoters, passives, detractors, promoterRate, passiveRate, detractorRate } = summary;
  const level = getNpsLevel(nps);
  const { insight, action } = buildNpsInsight({ total, promoters, passives, detractors, detractorRate, levelTone: level.tone });

  return (
    <div className="rounded-input border border-line bg-surface px-5 py-4 mb-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted mb-1">NPS Score</p>
          <div className="flex items-center gap-2">
            <strong className="text-3xl leading-none">{total ? signed(nps) : "—"}</strong>
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${LEVEL_BADGE_STYLE[level.tone]}`}>{level.label}</span>
          </div>
          <p className="text-xs text-[#475569] mt-1">จากคำตอบทั้งหมด {total} รายการ</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${CATEGORY_CHIP_STYLE.promoter}`}>{promoters} Promoters ({promoterRate}%)</span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${CATEGORY_CHIP_STYLE.passive}`}>{passives} Passives ({passiveRate}%)</span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${CATEGORY_CHIP_STYLE.detractor}`}>{detractors} Detractors ({detractorRate}%)</span>
        </div>
      </div>

      <NpsScale nps={total ? nps : 0} />

      <div className="mt-4 pt-3 border-t border-line">
        <p className="text-xs font-bold text-ink">NPS = % Promoters − % Detractors</p>
        <p className="text-xs text-[#475569] mt-1">
          Promoter คือคะแนน 9–10 ส่วน Passive คือคะแนน 7–8 และ Detractor คือคะแนน 0–6 ทั้งนี้ Passive จะไม่ทำให้คะแนน NPS เพิ่มขึ้นหรือลดลง
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-3">
        <div className="rounded-input bg-brand-blue-soft/40 border border-brand-blue/20 px-3 py-2.5">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-brand-blue mb-1">Insight</p>
          <p className="text-xs text-ink leading-relaxed">{insight}</p>
        </div>
        <div className="rounded-input bg-brand-green-soft/40 border border-brand-green/20 px-3 py-2.5">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-brand-green mb-1">Recommended Action</p>
          <p className="text-xs text-ink leading-relaxed">{action}</p>
        </div>
      </div>
    </div>
  );
}

const BREAKDOWN_DOT_STYLE = {
  promoter: "bg-brand-green",
  passive: "bg-brand-amber",
  detractor: "bg-ragnar-red"
};

export function ResponseSummaryCard({ summary }) {
  const { total, promoters, passives, detractors } = summary;
  const rows = [
    { tone: "promoter", label: "Promoters", count: promoters },
    { tone: "passive", label: "Passives", count: passives },
    { tone: "detractor", label: "Detractors", count: detractors }
  ];

  return (
    <div className="rounded-input border border-line bg-surface px-4 py-3">
      <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted mb-1.5">Response Summary</p>
      <p className="text-xs text-[#475569] leading-relaxed mb-2.5">
        มีคำตอบทั้งหมด {total} รายการ แบ่งเป็นกลุ่ม Promoters, Passives และ Detractors เพื่อช่วยให้ทีมเห็นว่าควรติดตามกลุ่มใดก่อน
      </p>
      <div className="space-y-1.5">
        {rows.map((row) => (
          <div key={row.tone} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-ink">
              <span className={`h-2 w-2 rounded-full ${BREAKDOWN_DOT_STYLE[row.tone]}`} />
              {row.label}
            </span>
            <strong>{row.count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
