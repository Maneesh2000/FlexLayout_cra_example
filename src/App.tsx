import { Layout, Model, TabNode, IJsonModel, Actions, DockLocation } from "flexlayout-react";
import { Survey, Model as SurveyModel } from "survey-react-ui";
import "survey-core/modern.min.css"; // SurveyJS CSS
import "./App.css";
import "flexlayout-react/style/light.css";
import { useState } from "react";

// JSON model for initial layout
const json = {
	global: {},
	borders: [],
	layout: {
		type: "column", // Main layout type, stacking header and content vertically
		weight: 50,
		children: [
			
			{
				type: "row", // Row for sidebar and main content
				weight: 100, // Weight for the remaining content area
				children: [
					{
						type: "tabset", // Sidebar menu container
						id: "sidebarMenu",
						enableTabStrip: false,
						weight: 7, // Sidebar width
						children: [
							{
								component: "sidebar", // Placeholder component for sidebar
							},
						],
					},
					{
						type: "row", // Row for sidebar and main content
						weight: 90,
						children: [
							{
								type: "tabset", // Main content container
								id: "mainTabSet",
                                enableTabStrip: false,
								weight: 7, // Main content width
								children: [
									{
										type: "tab",
										name: "One",
										component: "buttons", // Tab with button component
									},
									{
										type: "tab",
										name: "Survey",
										component: "survey", // Tab with survey component
									},
								],
							},
                            {
								type: "tabset", // Main content container
								id: "mainTabSet1",
                                enableTabStrip: false,
								weight: 16, // Main content width
								children: [
									{
										type: "tab",
										name: "One",
										component: "buttons", // Tab with button component
									},
									{
										type: "tab",
										name: "Survey",
										component: "survey", // Tab with survey component
									},
								],
							},
                            {
								type: "tabset", // Main content container
								id: "mainTabSet2",
                                // enableTabStrip: false,
								weight: 80, // Main content width
								children: [
									{
										type: "tab",
										name: "One",
										component: "buttons", // Tab with button component
									},
									{
										type: "tab",
										name: "Survey",
										component: "survey", // Tab with survey component
									},
								],
							},
						],
					},
				],
			},
		],
	},
	popouts: {
	    popout1: {
	        layout: {
	            type: "row",
	            weight: 100,
	            children: [
	                {
	                    type: "tabset",
	                    children: [
	                        {
	                            type: "tab",
	                            name: "Popout Tab",
	                            component: "survey",
	                        },
	                    ],
	                },
	            ],
	        },
	        rect: {
	            x: 200,    // X position on the screen
	            y: 150,    // Y position on the screen
	            width: 500, // Width of the popout window
	            height: 400 // Height of the popout window
	        },
	    },
	},
};

const App = () => {
	const [tabCount, setTabCount] = useState(1); // Track the number of tabs
	const [model] = useState(() => Model.fromJson(json)); // Create model from JSON

	// SurveyJS JSON schema
	const surveyJson = {
		title: "Simple Survey",
		description: "Please answer the following questions",
		elements: [
			{
				type: "text",
				name: "question1",
				title: "What is your name?",
			},
			{
				type: "radiogroup",
				name: "question2",
				title: "What is your favorite programming language?",
				choices: ["JavaScript", "Python", "Java", "Go"],
			},
			{
				type: "comment",
				name: "question3",
				title: "Any additional comments?",
			},
		],
	};

	// Create SurveyJS model
	const surveyModel = new SurveyModel(surveyJson);

	// Factory to render tab components
	const factory = (node: TabNode) => {
		const component = node.getComponent();

		if (component === "button") {
			return <button onClick={addTab}>{node.getName()}</button>;
		}

		if (component === "survey") {
			return <Survey model={surveyModel} />;
		}
	};

	// Function to add a new tab dynamically
	const addTab = () => {
		const newTabId = `tab_${tabCount + 1}`; // Create a unique ID for the new tab

		// Define the new tab node JSON
		const newTabNode = {
			type: "tab",
			name: `New Tab ${tabCount + 1}`, // Tab name
			component: "button", // Component type
			id: newTabId,
		};

		// Add the new tab node to the specified parent tabset
		model.doAction(
			Actions.addNode(
				newTabNode, // The new tab node
				"tabset_1", // Parent ID: Assuming you're adding to the root tabset
				DockLocation.CENTER, // The location in the tabset where the new tab will be added
				-1, // Use -1 to add the tab to the end of the tabset
				true // Select the new tab after adding
			)
		);

		setTabCount(tabCount + 1); // Increment the tab counter
	};

	// const addPopout = () => {
	//     const popoutLayout = {
	//         layout: {
	//             type: "row",
	//             children: [
	//                 {
	//                     type: "tabset",
	//                     children: [
	//                         {
	//                             type: "tab",
	//                             name: "Popout Tab",
	//                             component: "popoutComponent",
	//                         },
	//                     ],
	//                 },
	//             ],
	//         },
	//         rect: {
	//             x: 200,    // X position on the screen
	//             y: 150,    // Y position on the screen
	//             width: 500, // Width of the popout window
	//             height: 400 // Height of the popout window
	//         },
	//     };

	//     // Use addPopout method to trigger a new popout window with defined layout
	//     const newModel = model.clone();
	//     newModel.addPopout(popoutLayout.layout, popoutLayout.rect);
	//     setModel(newModel);
	// };

	return (
		<div>
			<div>
				<button onClick={addTab} style={{ marginBottom: "10px", width: "100%", height: "40px" }}>
					Add New Tab
				</button>
			</div>
			<Layout model={model} factory={factory} />
		</div>
	);
};

export default App;
