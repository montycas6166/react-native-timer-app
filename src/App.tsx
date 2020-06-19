import React, { useState } from "react"
import {
	Dimensions,
	SafeAreaView,
	StatusBar,
	Text,
	TouchableOpacity,
} from "react-native"
import styled, { ThemeProvider } from "styled-components/native"

import { iOSDarkTheme } from "./styles"
import { getRemaining } from "./utils/timerHelpers"
import useInterval from "./hooks/useInterval"

const { width } = Dimensions.get("window")

const App: React.FC = () => {
	const [theme] = useState(iOSDarkTheme)
	const [isRunning, setIsRunning] = useState(false)
	const [remainingSeconds, setRemainingSeconds] = useState(5)

	const { minutes, seconds } = getRemaining(remainingSeconds)

	useInterval(
		() => {
			setRemainingSeconds(currentSeconds => currentSeconds - 1)
		},
		isRunning ? 1000 : null
	)

	const toggleTimer = (): void => {
		setIsRunning(currentState => !currentState)
	}

	return (
		<ThemeProvider theme={theme}>
			<StatusBar barStyle="light-content" />
			<StyledSafeAreaView>
				<TimerText>{`${minutes}:${seconds}`}</TimerText>
				<Button onPress={toggleTimer}>
					<ButtonText>{isRunning ? "Stop" : "Pause"}</ButtonText>
				</Button>
			</StyledSafeAreaView>
		</ThemeProvider>
	)
}

const StyledSafeAreaView = styled(SafeAreaView)`
	align-items: center;
	background-color: ${(props): string => props.theme.primaryColor};
	flex: 1;
	justify-content: center;
`

const Button = styled(TouchableOpacity)`
	align-items: center;
	border-color: ${(props): string => props.theme.secondaryColor};
	border-radius: ${`${width / 2}px`};
	border-width: 10px;
	height: ${`${width / 2}px`};
	justify-content: center;
	margin-top: 30px;
	width: 50%;
`

const ButtonText = styled(Text)`
	color: ${(props): string => props.theme.secondaryColor};
	font-size: 45px;
`

const TimerText = styled(Text)`
	color: white;
	font-size: 90px;
`
export default App
