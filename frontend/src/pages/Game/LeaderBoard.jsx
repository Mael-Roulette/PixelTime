import BottomNavBar from "../../components/BottomNavBar"
import Footer from "../../components/Footer"

const LeaderBoard = () => {
  return (
    <>
      <BottomNavBar />

      <main className="leaderboard">
        <h1>Classement</h1>

        <section className="leaderboard-content">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rang</th>
                <th>Photo</th>
                <th>Pseudo</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }, (_, index) => (
                <tr key={index + 1}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={`/path/to/profile${index + 1}.jpg`}
                      alt={`Profil ${index + 1}`}
                      className="profile-image"
                    />
                  </td>
                  <td>Joueur{index + 1}</td>
                  <td>1000</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default LeaderBoard