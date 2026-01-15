// 카운터 스토어 훅 import
import { useCounterStore } from "./stores/counter.store";

// 카운터 패널 컴포넌트
const CounterPanel = () => {
  // 스토어에서 상태와 액션 가져오기
  const count = useCounterStore((s) => s.count);
  const increase = useCounterStore((s) => s.increase);
  const decrease = useCounterStore((s) => s.decrease);
  const reset = useCounterStore((s) => s.reset);
  const canDecrease = useCounterStore((s) => s.canDecrease);

  return (
    <div style={{ display: "grid", gap: 8, maxWidth: 240 }}>
      {/* 현재 카운터 값 표시 */}
      <div>count: {count}</div>

      {/* 카운터 증가 버튼 */}
      <button onClick={increase}>increase</button>
      {/* 카운터 감소 버튼 (canDecrease가 false면 비활성화) */}
      <button onClick={decrease} disabled={!canDecrease}>
        decrease
      </button>
      {/* 카운터 초기화 버튼 */}
      <button onClick={reset}>reset</button>
    </div>
  );
};

export default CounterPanel;
