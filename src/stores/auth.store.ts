import { create } from "zustand";

export type User = {
  id: string;
  name: string;
  email: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

type AuthActions = {
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  clearError: () => void;
};

export type AuthStore = AuthState & AuthActions;

/**
 * 실습용 가짜 로그인 API 함수입니다.
 * 실제 프로젝트에서는 서버와 통신하는 진짜 API로 교체해야 합니다.
 *
 * @param input - 로그인에 필요한 이메일과 비밀번호가 담긴 객체
 * @returns Promise<User> - 로그인 성공 시 사용자 정보를 반환하는 Promise
 *
 * 동작 방식:
 * 1. Promise를 생성하여 비동기 작업을 시뮬레이션합니다.
 * 2. setTimeout으로 700ms 지연시켜 실제 API 호출처럼 만듭니다.
 * 3. 이메일이 "test@test.com"이고 비밀번호가 "1234"면 성공(resolve)
 * 4. 그 외의 경우 실패(reject) 처리합니다.
 */
function fakeLoginApi(input: LoginInput): Promise<User> {
  // ✅ 실습용 가짜 API (나중에 진짜 API로 교체)

  // Promise는 비동기 작업의 결과를 나타내는 객체입니다.
  // resolve: 성공했을 때 호출하는 함수
  // reject: 실패했을 때 호출하는 함수
  return new Promise((resolve, reject) => {
    // setTimeout: 지정된 시간(밀리초) 후에 코드를 실행합니다.
    // 여기서는 700ms 후에 로그인 처리를 합니다 (실제 API 호출처럼 보이게 하기 위함)
    setTimeout(() => {
      // 하드코딩된 테스트 계정으로 로그인을 검증합니다.
      // 실제로는 서버에서 데이터베이스를 확인해야 합니다.
      if (input.email === "test@test.com" && input.password === "1234") {
        // 로그인 성공: resolve 함수를 호출하여 사용자 정보를 반환합니다.
        resolve({
          id: "u_1",
          name: "테스트유저",
          email: input.email,
        });
      } else {
        // 로그인 실패: reject 함수를 호출하여 에러를 발생시킵니다.
        // 이 에러는 catch 블록에서 잡힙니다.
        reject(new Error("이메일 또는 비밀번호가 올바르지 않습니다."));
      }
    }, 700);
  });
}

/**
 * 인증 관련 상태를 관리하는 zustand 스토어입니다.
 *
 * @param set - 스토어의 상태를 업데이트하는 함수
 *
 * 이 스토어는 다음을 관리합니다:
 * - 사용자 정보 (user)
 * - 로그인 상태 (isAuthenticated)
 * - 로딩 상태 (isLoading)
 * - 에러 메시지 (error)
 */
export const useAuthStore = create<AuthStore>((set) => ({
  // === 상태 (State) ===

  // 현재 로그인한 사용자 정보 (로그인하지 않았으면 null)
  user: null,

  // 로그인 여부를 나타내는 불린 값 (true면 로그인됨, false면 로그아웃됨)
  isAuthenticated: false,

  // 로그인 요청이 진행 중인지 여부 (true면 로딩 중, false면 완료)
  isLoading: false,

  // 로그인 실패 시 에러 메시지 (에러가 없으면 null)
  error: null,

  // === 액션 (Actions) ===

  /**
   * 로그인을 수행하는 비동기 함수입니다.
   *
   * 동작 순서:
   * 1. 로딩 상태를 true로 설정하고 이전 에러를 초기화합니다.
   * 2. fakeLoginApi를 호출하여 로그인을 시도합니다.
   * 3. 성공하면 사용자 정보를 저장하고 로그인 상태를 true로 설정합니다.
   * 4. 실패하면 에러 메시지를 저장하고 로그인 상태를 false로 설정합니다.
   *
   * @param input - 로그인에 필요한 이메일과 비밀번호
   */
  login: async (input) => {
    // 로그인 시작: 로딩 상태를 true로 설정하고 이전 에러를 지웁니다.
    set({ isLoading: true, error: null });

    // try-catch: 에러가 발생할 수 있는 코드를 안전하게 처리합니다.
    try {
      // await: Promise가 완료될 때까지 기다립니다.
      // fakeLoginApi가 성공하면 사용자 정보를 반환합니다.
      const user = await fakeLoginApi(input);

      // 로그인 성공: 사용자 정보를 저장하고 로그인 상태를 true로 설정합니다.
      set({
        user, // 받아온 사용자 정보 저장
        isAuthenticated: true, // 로그인 상태를 true로 변경
        isLoading: false, // 로딩 완료
      });
    } catch (e) {
      // 로그인 실패: 에러를 처리합니다.
      // e가 Error 객체인지 확인하고, 맞으면 에러 메시지를 가져옵니다.
      // 그렇지 않으면 기본 에러 메시지를 사용합니다.
      const message =
        e instanceof Error
          ? e.message
          : "로그인 중 알 수 없는 오류가 발생했습니다.";

      // 에러 상태 저장: 사용자 정보를 지우고 로그인 상태를 false로 설정합니다.
      set({
        user: null, // 사용자 정보 초기화
        isAuthenticated: false, // 로그인 상태를 false로 변경
        isLoading: false, // 로딩 완료
        error: message, // 에러 메시지 저장
      });
    }
  },

  /**
   * 로그아웃을 수행하는 함수입니다.
   * 사용자 정보를 지우고 로그인 상태를 false로 변경합니다.
   */
  logout: () => {
    set({
      user: null, // 사용자 정보 삭제
      isAuthenticated: false, // 로그인 상태를 false로 변경
      error: null, // 에러 메시지도 초기화
    });
  },

  /**
   * 사용자 정보를 직접 설정하는 함수입니다.
   * 주로 앱 시작 시 저장된 로그인 정보를 복원할 때 사용합니다.
   *
   * @param user - 설정할 사용자 정보 (null이면 로그아웃 상태)
   */
  setUser: (user) => {
    set({
      user, // 사용자 정보 설정
      isAuthenticated: Boolean(user), // user가 있으면 true, null이면 false
    });
  },

  /**
   * 에러 메시지를 지우는 함수입니다.
   * 사용자가 에러 메시지를 확인한 후 수동으로 지울 때 사용합니다.
   */
  clearError: () => {
    set({ error: null }); // 에러 메시지 초기화
  },
}));
