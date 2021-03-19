import Post from "./Post.js"
import Followers from "./Followers.js"
import ImageUpload from "./ImageUpload.js"

test("can post comment", () => {
	render(
	    <post
		postId = 0
		user = "testUser" 
		username = "testUploader" 
		caption = "testCaption" 
		imageUrl = null
		/>
	)
    const expectedResult = "test"
    userEvent.click(Screen.getByText('Post'));
    expect(Screen.getByText('Post')).toBeChecked();
});

test("can post pictures", () => {
  render (
  	  <ImageUpload 
	  username = "TestUser"
	  />
  )
  userEvent.click(Screen.getByText('UPLOAD'));
  expect.(Screen.getByText('UPLOAD').toBeChecked();
});

test("can follow user", () => {
  render(
        <Followers 
          user="TestUser"
          username="TestTarget"
      />
  )

  userEvent.click(Screen.getByText('Follow User'));
  expect(Screen.getByText('Follow User').toBeChecked();

});