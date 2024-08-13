// pages/index.js
import Layout from "../components/Layout";
import Link from "next/link";

// Fetch data on server side
export async function getServerSideProps() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/lagus`);
    const data = await response.json();
    return {
      props: {
        lagus: data.data || [], // Sesuaikan dengan struktur data dari API
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        lagus: [],
      },
    };
  }
}

function HomePage({ lagus }) {
  return (
    <Layout>
      <div className="container" style={{ marginTop: '80px' }}>
        <div className="row">
          <div className="col-md-12">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body">
                <Link href="/add">
                  <button className="btn btn-primary border-0 shadow-sm mb-3">TAMBAH</button>
                </Link>
                <table className="table table-bordered mb-0">
                  <thead>
                    <tr>
                      <th scope="col">MP3</th>
                      <th scope="col">TITLE</th>
                      <th scope="col">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lagus.map((lagu) => (
                      <tr key={lagu.id}>
                        <td className="text-center">
                          <audio controls>
                            <source src={`${process.env.NEXT_PUBLIC_API_BACKEND}/storage/lagus/${lagu.mp3}`} type="audio/mp3" />
                            Your browser does not support the audio element.
                          </audio>
                        </td>
                        <td>{lagu.title}</td>
                        <td className="text-center">
                          <Link href={`/edit/${lagu.id}`}>
                            <button className="btn btn-sm btn-primary border-0 shadow-sm mb-3 me-3">EDIT</button>
                          </Link>
                          <button
                            className="btn btn-sm btn-danger border-0 shadow-sm mb-3"
                            onClick={() => handleDelete(lagu.id)}
                          >
                            DELETE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

async function handleDelete(id) {
  if (confirm('Are you sure you want to delete this song?')) {
    await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/lagus/${id}`, {
      method: 'DELETE',
    });
    // Reload the page or update the UI accordingly
    window.location.reload();
  }
}

export default HomePage;
