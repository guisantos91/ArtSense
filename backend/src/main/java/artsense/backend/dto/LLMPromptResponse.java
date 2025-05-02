package artsense.backend.dto;

public class LLMPromptResponse {
    private String response;
    private String htmlGoogleSearchSuggestion;

    public LLMPromptResponse(String response, String htmlGoogleSearchSuggestion) {
        this.response = response;
        this.htmlGoogleSearchSuggestion = htmlGoogleSearchSuggestion;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public String getHtmlGoogleSearchSuggestion() {
        return htmlGoogleSearchSuggestion;
    }

    public void setHtmlGoogleSearchSuggestion(String htmlGoogleSearchSuggestion) {
        this.htmlGoogleSearchSuggestion = htmlGoogleSearchSuggestion;
    }
}
