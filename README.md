# Disclone
Practice webapp


Example response from /api/chatrooms:
{
    "success": true,
    "error": null,
    "data": {
        "results": [
            {
                "id": "589a9cca-0a8e-40e3-a922-a45326aae077",
                "name": "GroupChatTest",
                "createdAt": "2024-07-02T17:35:38.215Z",
                "updatedAt": "2024-07-02T17:35:38.215Z",
                "Messages": [
                    {
                        "id": "ab634093-79c8-4e5a-85a1-cbad536a5367",
                        "content": "Welcome to the Group test chat!",
                        "type": "text",
                        "createdAt": "2024-07-02T17:35:38.221Z",
                        "updatedAt": "2024-07-02T17:35:38.221Z",
                        "sender_id": "c43e11bc-f93c-4893-a62d-b03a8ac58027",
                        "chat_id": "589a9cca-0a8e-40e3-a922-a45326aae077"
                    }
                ],
                "Users": [
                    {
                        "id": "c43e11bc-f93c-4893-a62d-b03a8ac58027",
                        "email": "bleep@gmail.com",
                        "createdAt": "2024-07-02T17:35:18.876Z",
                        "updatedAt": "2024-07-02T17:35:18.876Z"
                    },
                    {
                        "id": "400b7be8-f533-4694-800c-c70b186b9d04",
                        "email": "asdf@gmail.com",
                        "createdAt": "2024-07-02T17:34:57.694Z",
                        "updatedAt": "2024-07-02T17:34:57.694Z"
                    }
                ]
            },
            {
                "id": "0154abba-af53-4713-bec0-008e52895d25",
                "name": "LonelyTestChat",
                "createdAt": "2024-07-02T17:35:58.055Z",
                "updatedAt": "2024-07-02T17:35:58.055Z",
                "Messages": [
                    {
                        "id": "75e8ff90-f8a3-421a-8fc2-41635f973217",
                        "content": "Welcome to the Lonely test chat!",
                        "type": "text",
                        "createdAt": "2024-07-02T17:35:58.061Z",
                        "updatedAt": "2024-07-02T17:35:58.061Z",
                        "sender_id": "c43e11bc-f93c-4893-a62d-b03a8ac58027",
                        "chat_id": "0154abba-af53-4713-bec0-008e52895d25"
                    }
                ],
                "Users": [
                    {
                        "id": "c43e11bc-f93c-4893-a62d-b03a8ac58027",
                        "email": "bleep@gmail.com",
                        "createdAt": "2024-07-02T17:35:18.876Z",
                        "updatedAt": "2024-07-02T17:35:18.876Z"
                    }
                ]
            }
        ]
    }
}