https://ssoa1111.github.io/card-slide/assets/pages/general-card.html
 
# card-slide
프로젝트에서 진행했던 card slide 재구현

## 사용할 언어
프로젝트에서는 vue를 사용했으나 재구현에는 간단하게 사용

1. html, sass, js 구현하는 방법 ( 함수형 )
2. html, sass, js + three.js 활용하여 구현 ( 클래스형 )

## card slide 사용
```
    <div class="container">
        <div class="card-wrap">
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
        </div>
    </div>

    const cardEffect = cardUiEffect()
    const cardWrap = document.querySelector('.card-wrap')
    cardEffect.init(cardWrap, { toCenter: true })
```
## card slide 옵션
toCenter : boolean ( default : false ) - 카드들이 원형의 center를 바라보게 함           
sensitivity : Number ( default : 0.3 ) - 드래그(터치)값에 따라 회전되는 속도           
minScale : Number ( default : 0.5 ) - 카드의 최소 스케일 ( 1이하 지정 x )

## card slide 효과 구현 요건
1. 카드가 원형적으로 배치
2. 마우스(터치) 드래그 값에 따라 원형으로 회전
3. 카드 클릭 시 각각의 특정 사이트로 진입

### 1. 카드가 원형적으로 배치
1.1 카드가 원형으로 배치        
    원의 공식 활용 : a^2 + b^2 + r^2         
    x = rcos(theta)     
    y = rsin(theta)     

1.2 입체 효과를 위해 y축 -> z축 활용       
    x = rcos(theta)     
    z = rsin(theta)     

1.3 카드의 초기 위치 설정        
    각도 = 원의각도 (360) / 카드의 개수         
    카드 각각의 각도 = 각도 * 카드의 index

### 2. 마우스(터치) 드래그 값에 따라 원형으로 회전
2.1 마우스, 터치 값 : pointer event 사용

2.2 마우스, 터치 값을 변환     
    move.x = e.x - start.x        
    움직인 각도 = 카드 각각의 각도 + move.x                 
    radian 변환 값 = 움직인 각도 * Math.PI / 180

### 3. 카드 클릭 시 각각의 특정 사이트로 진입
3.1 click 감지 요건 체크
이벤트 중에서 click이벤트가 맨 마지막에 실행되므로 pointer 이벤트에서 확인 후 처리       
distance = Math.abs(end.x - start.x) < 10 으로 임의 설정하였음

### 4. 그 외
4.1 기존 프로젝트에서의 요건은 움직임 범위를 90 ~ -90까지만 가능하게 했으나 현재는 지정하지 않아서 마우스 값이 빠르게 변하면 transition이 엉키는 현상이 있음 => 개선 방안으로 쓰로틀링 적용이 있음.      
4.2 기존 프로젝트에서의 요건이 카드 4장으로 되어있어서 코드 내에서 각도 값을 직접 지정했으나 이번에는 카드 개수에 따라 자동적으로 값을 계산하여 할당하도록 하였음.         
4.3 옵션으로 카드가 가운데를 바라보는 유형 추가함.

### 5. 작업하면서 새로 알게 된 것 & 어려웠던 점
5.1 z-index는 소수 값이 들어가게 되면 적용되지 않음.             
5.2 scale이 -값이 되어도 값을 절대 값으로 적용함.          
5.3 과거에 보정 값 계산했던 것이 떠올라서 다른 방법을 생각하기 어려웠음.                
```
// 예전 보정 값 사용했을 때 예시
0.4 * (1 + (dir * Math.sin(theta))) // 0 ~ 0.8 범위의 값
0.2 + ( 0.4 * (1 + (dir * Math.sin(theta))) ) // 0.2 ~ 1 범위의 값 (0.2 보장)
0.2 + ( 0.4 * dir * Math.sin(theta) ) // -0.2 ~ 0.6 범위의 값

// 현재 min, max로 처리
const value = Math.min(1, Math.max(option.minScale, scale))
```

### 6. 후기
6.1 기존 프로젝트는 마우스의 값에 따라 방향체크를 하고 그 값을 움직이는 중에 음수 양수 값을 곱하는 작업을 했었음.     
그러나 cos, sin의 함수 특성이 +-값을 반복하면서 반환하기 때문에 위의 작업은 필요없었고 내용만 복잡해지게 되었음 => 개선함.
6.2 과거에 '움직임 범위를 90 ~ -90'로 했던 이유가 작업하면서 다시 상기되는 기회가 되었음.

