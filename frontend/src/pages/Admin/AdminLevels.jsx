import { useEffect, useState } from "react";
import BottomNavBar from "../../components/BottomNavBar";
import adminService from "../../../services/adminService";
import Footer from "../../components/Footer";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";

const AdminLevels = () => {
	const [levels, setLevels] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const location = useLocation();
	const isOnMainRoute = location.pathname === "/admin/levels";

	const fetchLevels = async () => {
		try {
			setLoading(true);
			const response = await adminService.getLevels();
			setLevels(response);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchLevels();
	}, []);

	if (loading) {
		return <p className='loading'>Chargement des niveaux...</p>;
	}

  return (
    <>
      <BottomNavBar />

      <main className='admin-levels'>
        <section className='admin-levels-content'>
          <NavLink to='/admin' className='admin-back'>
            Retour
          </NavLink>
          <h1 className='admin-levels-title'>Liste des niveaux</h1>

          {levels.length === 0 ? (
            <p>Aucun niveau</p>
          ) : (
            <table className='admin-levels-table'>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Nom</th>
                  <th>Score minimum</th>
                  <th>Nombre de joueurs</th>
                </tr>
              </thead>
              <tbody>
                {levels.map((level) => {
                  return (
                    <tr key={level.id}>
                      <td>
                        {level.image ? (
                          <img src={level.image} alt={level.name} />
                        ) : (
                          <div className='image-initial'>
                            <p>{level.name?.charAt(0).toUpperCase()}</p>
                          </div>
                        )}
                      </td>
                      <td>{level.name}</td>
                      <td>{level.minScore}</td>
                      <td>{level.userCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default AdminLevels;
