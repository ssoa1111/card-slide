/**
 * 카드 회전하는 효과
 * common : init, setup, setElement, setProperty, setAction, setEvent
 * custom : moveTransform, moveZindex, moveStyle
 * @returns 실행부 
 */

function cardUiEffect() {
    let $target,
        option = {
            toCenter: false,
            sensitivity: 0.3,
            minScale: 0.5
        },
        card,
        cardCurrentArr = [],
        actions = {},

        startX,
        moveX = 0,
        endX,
        minDistance = 10, // 최소 움직임
        dir = 0,

        factorX = 120,
        factorY = 10,
        factorZ = 100,

        radian = Math.PI / 180,
        circleAngle = 360,
        angle,

        isClickable, // 클릭 가능 여부
        isMoving = false; // 드래그

    // constant
    const Direction = {
        RIGHT: 1,
        LEFT: -1,
        NONE: 0
    };

    function init(_$target, _option) {
        $target = _$target

        if (!$target) return
        if ($target.ui) return
        $target.ui = this

        option = { ...option, ..._option }

        setup()
    }
    function setup() {
        setElement()

        if (!card) throw Error('not exist card element');
        setProperty()
        setAction()
        setEvent()
    }
    function setElement() {
        card = $target.querySelectorAll('.card')
    }
    function setProperty() {
        cardCurrentArr = [...card]
        angle = circleAngle / card.length

        cardCurrentArr.forEach((card, index) => {
            option.toCenter && card.setAttribute('data-rotate', angle * index)
            card.setAttribute('data-angle', angle * index)
        })

        moveStyle(angle)
    }
    function setAction() {
        actions.pointerdown = (e) => {
            if (isMoving) return

            startX = e.x
            isMoving = true
        }
        actions.pointermove = (e) => {
            if (!isMoving) return

            moveX = Math.floor((e.x - startX) * option.sensitivity)
            moveStyle(angle, moveX)
        }
        actions.pointerup = endMove
        actions.pointerleave = endMove // 드래그 중에 영역 나갈 때

        actions.click = (e) => { // 드래그 중에 영역 나갈 때
            if (!e.target.classList.contains('card')) return
            if (isClickable) {
                alert('click')
                isClickable = false
            }
        }

        function endMove(e) {
            if (minDistance > Math.abs(startX - e.x)) {
                isMoving = false
                isClickable = true
                moveStyle(angle)
                return
            }

            if (!isMoving) return

            if (moveX > 0) {
                dir = Direction.RIGHT
            } else if (moveX < 0) {
                dir = Direction.LEFT
            } else {
                dir = Direction.NONE
            }

            cardCurrentArr.forEach((card, index) => {
                let baseAngle = (angle * index) + moveX
                let moveAngle
                if (dir === Direction.RIGHT) {
                    moveAngle = baseAngle + 90

                    if (moveAngle > circleAngle) {
                        moveAngle %= circleAngle
                    }
                } else if (dir === Direction.LEFT) {
                    moveAngle = baseAngle
                    if (moveAngle < 0) {
                        moveAngle = (moveAngle + 360) % circleAngle
                    }
                }

                card.setAttribute('data-angle', moveAngle)
            })

            cardCurrentArr = cardCurrentArr.sort((a, b) => a.dataset.angle - b.dataset.angle)
            moveStyle(angle)

            moveX = 0
            isMoving = false
        }
    }
    function setEvent() {
        $target.addEventListener("pointerdown", actions.pointerdown)
        $target.addEventListener("pointermove", actions.pointermove)
        $target.addEventListener("pointerup", actions.pointerup)
        $target.addEventListener("pointerleave", actions.pointerleave)
        $target.addEventListener("click", actions.click)
    }
    function moveTransform(_angle) {
        const angleX = Math.cos((_angle - 90) * radian).toFixed(3) * factorX
        const angleY = Math.sin((_angle - 90) * radian).toFixed(3) * factorY
        const angleZ = Math.sin((_angle - 90) * radian).toFixed(3) * factorZ

        const scaleAngle = Math.cos(_angle * radian)
        const scale = option.minScale * (scaleAngle + 1)
        const scaleMinMax = Math.min(1, Math.max(option.minScale, scale))

        return `translate3d(${angleX}px, ${-angleY}px, ${-angleZ}px) scale(${scaleMinMax})`
    }
    function moveZindex(angle) {
        const angleY = Number((Math.sin((angle - 90) * radian) * cardCurrentArr.length).toFixed(0))
        // z-index는 소수값 적용 안됨

        return -angleY
    }
    function moveStyle(_angle, moveValue = 0, isEnd = false) {
        cardCurrentArr.forEach((card, index) => {
            const currentRotate = (_angle * index) + moveValue;
            card.style.transform = moveTransform(currentRotate)

            if (option.toCenter) {
                card.style.transform += `rotateY(${currentRotate}deg)`
            }
            card.style.zIndex = moveZindex((_angle * index) + moveValue)
        })
    }

    return {
        init
    }
}