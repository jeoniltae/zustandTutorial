// zustand 라이브러리에서 create 함수를 가져옵니다.
// create 함수는 상태 관리 스토어를 생성하는 데 사용됩니다.
import { create } from "zustand";

/**
 * 카운터의 상태를 정의하는 타입입니다.
 * count: 현재 카운터의 값을 저장하는 숫자 타입
 */
type CounterState = {
  count: number;
};

/**
 * 카운터의 액션(함수)들을 정의하는 타입입니다.
 * increase: 카운터를 1 증가시키는 함수
 * decrease: 카운터를 1 감소시키는 함수
 * increaseBy: 카운터를 지정된 값만큼 증가시키는 함수
 * reset: 카운터를 0으로 초기화하는 함수
 * canDecrease: 카운터를 감소시킬 수 있는지 여부를 반환하는 getter 함수
 */
type CounterActions = {
  increase: () => void;
  decrease: () => void;
  increaseBy: (by: number) => void;
  reset: () => void;
  canDecrease: () => boolean;
};

/**
 * CounterState와 CounterActions를 합친 전체 스토어 타입입니다.
 * 상태와 액션을 모두 포함하는 카운터 스토어의 완전한 타입 정의입니다.
 */
type CounterStore = CounterState & CounterActions;

/**
 * zustand를 사용하여 카운터 스토어를 생성합니다.
 *
 * @param set - 상태를 업데이트하는 함수 (새로운 상태 객체를 받아 스토어를 업데이트)
 * @param get - 현재 상태를 가져오는 함수 (스토어의 현재 상태 값을 반환)
 *
 * @returns 카운터 상태와 액션들을 포함하는 스토어 객체
 */
const useCounterStore = create<CounterStore>((set, get) => ({
  // === 상태 (State) ===
  // 카운터의 초기값을 0으로 설정합니다.
  count: 0,

  // === 액션 (Actions) ===
  /**
   * 카운터 값을 1 증가시킵니다.
   * 이전 상태를 받아서 count를 1 증가시킨 새로운 상태를 반환합니다.
   */
  increase: () => set((state) => ({ count: state.count + 1 })),

  /**
   * 카운터 값을 1 감소시킵니다.
   * 이전 상태를 받아서 count를 1 감소시킨 새로운 상태를 반환합니다.
   */
  decrease: () => set((state) => ({ count: state.count - 1 })),

  /**
   * 카운터 값을 지정된 값(by)만큼 증가시킵니다.
   * get() 함수를 사용하여 현재 상태를 가져온 후, by 값만큼 더한 값을 설정합니다.
   *
   * @param by - 증가시킬 값
   */
  increaseBy: (by) => set({ count: get().count + by }),

  /**
   * 카운터 값을 0으로 초기화합니다.
   */
  reset: () => set({ count: 0 }),

  /**
   * 카운터를 감소시킬 수 있는지 여부를 반환하는 getter 함수입니다.
   * count가 0보다 크면 true, 그렇지 않으면 false를 반환합니다.
   * 함수로 구현하여 항상 최신 count 값을 기반으로 계산합니다.
   *
   * @returns count > 0이면 true, 그렇지 않으면 false
   */
  canDecrease: () => get().count > 0,
}));

// 카운터 스토어를 다른 컴포넌트에서 사용할 수 있도록 export합니다.
export { useCounterStore };
