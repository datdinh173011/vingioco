import styled from 'styled-components'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Modal from '@mui/material/Modal'
import { useCallback, useState, useRef, useEffect } from 'react'

const Backdrop = styled.div`
	position: fixed;
	left: 0;
	bottom: 50%;
`

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	padding: 16px;
	position: relative;
	display: flex;
	flex-direction: column;
`

function formatTimer(time: integer): string {
	let result = "00:00"
	let minutes = Math.floor(time / 60);
	let seconds = time % 60;
	result = `${minutes.toString().length === 1 ? '0' + minutes : minutes}:${seconds.toString().length === 1 ? '0' + seconds : seconds}`
	return result;
}

export default function Pomodoro() {

	const [openPomodoro, setOpenPomodoro] = useState<boolean>(false)
	const [mode, setMode] = useState<number>(0)
	const [modeTime, setModeTime] = useState<Array<number>>([900, 300, 600])
	const [timeLeft, setTimeLeft] = useState<number>(modeTime[mode])
	const [timer, setTimer] = useState(formatTimer(timeLeft))
	const timerId: { current: any } = useRef(null);

	const handleStart = () => {
		timerId.current = setInterval(
			() => {
				setTimeLeft(prev => prev - 1);
			},
			1000
		)
	}

	useEffect(
		() => {
			if (timeLeft < 0) {
				clearInterval(timerId.current)
				timerId.current = null
				setTimeLeft(modeTime[mode])
				alert("Time's up!")
			} else {
				setTimer(formatTimer(timeLeft));
			}
		},
		[timeLeft, modeTime, mode]
	)

	const handleTogglePomodoro = useCallback(
		() => {
			setOpenPomodoro(!openPomodoro);
		},
		[openPomodoro]
	)

	const handleChangeMode = useCallback(
		(event: object, value: number) => {
			setMode(value)
			if (timerId.current != null) {
				clearInterval(timerId.current)
				timerId.current = null;
			}
			setTimeLeft(modeTime[value])
		},
		[modeTime, timerId]
	)

	return (
		<>
			{
				openPomodoro ? (
					<Modal
						open={openPomodoro}
						onClose={handleTogglePomodoro}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Card
							sx={{
								width: "32%",
								position: "absolute",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								backgroundColor: "white",
								color: "black"
							}}
						>
							<CardHeader
								title="Pomodoro"
							/>
							<CardContent>
								<div
									style={{
										width: "100%"
									}}
								>
									<BottomNavigation
										showLabels
										value={mode}
										onChange={handleChangeMode}
										sx={{
											backgroundColor: "white",
											color: "black",
											display: "flex",
											justifyContent: "space-around",
											alignItems: "center",
										}}
									>
										<BottomNavigationAction label="Pomodoro" sx={{ color: "black" }} />
										<BottomNavigationAction label="Short Break" sx={{ color: "black" }} />
										<BottomNavigationAction label="Long Break" sx={{ color: "black" }} />
									</BottomNavigation>
								</div>
								<div>
									<div
										style={{
											width: "100%",
											textAlign: "center",
											fontSize: "6rem"
										}}
									>{timer}</div>
									<div
										style={{
											width: "100%"
										}}
									>
										<Button
											color="primary"
											sx={{
												display: "flex",
												margin: "0 auto"
											}}
											onClick={handleStart}
											disabled={timerId.current != null}
										>
											START
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</Modal>
				) : (
					<Backdrop>
						<Wrapper>
							<Button
								variant="contained"
								color="secondary"
								onClick={handleTogglePomodoro}
							>
								Pomodoro
							</Button>
						</Wrapper>
					</Backdrop>
				)
			}
		</>
	)
}
