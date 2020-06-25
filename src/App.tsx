import React, { useEffect, useState } from "react"
import {
	Dimensions,
	Platform,
	SafeAreaView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from "react-native"
import { Picker } from "@react-native-community/picker"
import styled, { css, ThemeProvider } from "styled-components/native"

import { iOSDarkTheme } from "./styles"
import { AVAILABLE_MINUTES, AVAILABLE_SECONDS } from "./constants"
import { convertToSeconds, getRemaining } from "./utils/timerHelpers"
import useInterval from "./hooks/useInterval"
import normalize from "./utils/normalize"

interface TimerButtonProps {
	isRunning: boolean
}

const { width } = Dimensions.get("window")

const App: React.FC = () => {
	const [theme] = useState(iOSDarkTheme)
	const [isRunning, setIsRunning] = useState(false)
	const [remainingSeconds, setRemainingSeconds] = useState(5)
	const [selectedMinutes, setSelectedMinutes] = useState("5")
	const [selectedSeconds, setSelectedSeconds] = useState("5")

	const { minutes, seconds } = getRemaining(remainingSeconds)

	useInterval(
		() => {
			setRemainingSeconds(currentSeconds => currentSeconds - 1)
		},
		isRunning ? 1000 : null
	)

	useEffect(() => {
		if (remainingSeconds === 0) {
			resetTimer()
		}
	}, [remainingSeconds])

	const toggleTimer = (): void => {
		setIsRunning(currentState => !currentState)
		setRemainingSeconds(convertToSeconds(selectedMinutes, selectedSeconds))
	}

	const resetTimer = (): void => {
		setIsRunning(false)
		setRemainingSeconds(5)
	}

	const Pickers: React.FC = () => {
		return (
			<PickerContainer>
				<StyledPicker
					itemStyle={pickerItemStyle}
					mode="dropdown"
					selectedValue={selectedMinutes}
					onValueChange={(itemValue): void => {
						setSelectedMinutes(itemValue.toString())
					}}
				>
					{AVAILABLE_MINUTES.map(value => (
						<Picker.Item key={value} label={value} value={value} />
					))}
				</StyledPicker>
				<PickerLabel>minutes</PickerLabel>
				<StyledPicker
					itemStyle={pickerItemStyle}
					mode="dropdown"
					selectedValue={selectedSeconds}
					onValueChange={(itemValue): void => {
						setSelectedSeconds(itemValue.toString())
					}}
				>
					{AVAILABLE_SECONDS.map(value => (
						<Picker.Item key={value} label={value} value={value} />
					))}
				</StyledPicker>
				<PickerLabel>seconds</PickerLabel>
			</PickerContainer>
		)
	}

	return (
		<ThemeProvider theme={theme}>
			<StatusBar barStyle="light-content" />
			<StyledSafeAreaView>
				{isRunning ? (
					<TimerText>{`${minutes}:${seconds}`}</TimerText>
				) : (
					<Pickers />
				)}
				<TimerButton isRunning={isRunning} onPress={toggleTimer}>
					<TimerButtonText isRunning={isRunning}>
						{isRunning ? "Stop" : "Start"}
					</TimerButtonText>
				</TimerButton>
				<ResetButton onPress={resetTimer}>
					<ResetButtonText>Reset</ResetButtonText>
				</ResetButton>
			</StyledSafeAreaView>
		</ThemeProvider>
	)
}

const pickerItemStyle = { color: "#FFF", fontSize: 20 }

const StyledSafeAreaView = styled(SafeAreaView)`
	align-items: center;
	background-color: ${(props): string => props.theme.primaryColor};
	flex: 1;
	justify-content: center;
`

const TimerButton = styled(TouchableOpacity)<TimerButtonProps>`
	align-items: center;
	border-color: ${(props): string =>
		props.isRunning ? props.theme.accentColor : props.theme.secondaryColor};
	border-radius: ${`${width / 2}px`};
	border-width: 10px;
	height: ${`${width / 2}px`};
	justify-content: center;
	/* margin-top: 10%; */
	width: 50%;
`

const TimerButtonText = styled(Text)<TimerButtonProps>`
	color: ${(props): string =>
		props.isRunning ? props.theme.accentColor : props.theme.secondaryColor};
	font-size: ${normalize(38) + "px"};
`

const TimerText = styled(Text)`
	color: white;
	font-size: ${normalize(75) + "px"};
	margin-bottom: 2%;
`

const ResetButton = styled(TouchableOpacity)`
	align-items: center;
	justify-content: center;
	margin-top: 10%;
`

const ResetButtonText = styled(Text)`
	color: ${(props): string => props.theme.dimTextColorOnPrimary};
	font-size: ${normalize(22) + "px"};
`

const PickerContainer = styled(View)`
	align-items: center;
	flex-direction: row;
	margin-bottom: 20%;
`

const StyledPicker = styled(Picker)`
	width: 20%;
	${Platform.select({
		android: css`
			background-color: ${(props): string => props.theme.primaryColor};
			color: ${(props): string => props.theme.textColorOnPrimary};
			margin-left: 5%;
			margin-right: -10%;
		`,
	})};
`

const PickerLabel = styled(Text)`
	color: white;
	font-size: ${normalize(18) + "px"};
`

export default App
