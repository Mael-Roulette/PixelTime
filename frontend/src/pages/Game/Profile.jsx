import BottomNavBar from "../../components/BottomNavBar";

const Profile = () => {
  return (
    <>
			<BottomNavBar />

      <main className="profile">
        <div className="profile-picture">

        </div>

        <div className="profile-info">
          <h1>Nom d'utilisateur</h1>
        </div>
      </main>
    </>
  );
}

export default Profile;